import os
import uuid
from datetime import datetime, timedelta
from ipaddress import IPv4Address, IPv6Address
from typing import Annotated, Optional

from authx import AuthXConfig, AuthX
from beanie import Document, Link, Indexed, WriteRules
from fastapi import APIRouter, Depends, Request, Cookie
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import Field
from starlette.responses import Response

from module.user import User
from util import generate_hash

RT_EXPIRE = timedelta(hours=int(os.getenv("REFRESH_TOKEN_EXPIRE_IN_HOURS")))
RT_COOKIE_NAME = os.getenv("REFRESH_TOKEN_COOKIE_NAME")


class RefreshToken(Document):
    user: Link[User]
    expire_at: datetime
    hashed_token: Annotated[str, Indexed()]
    revoked: bool = False

    # Debug Info
    issued_at: Annotated[datetime, Field(default_factory=datetime.now)]
    ip_addr: Optional[IPv4Address | IPv6Address] = None
    user_agent: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')

config = AuthXConfig()
config.JWT_ALGORITHM = "HS256"
config.JWT_SECRET_KEY = "<SECRET_KEY_HERE>"
Auth = AuthX(config = config, model = User)

@Auth.set_subject_getter
async def get_current_user(uid:str):
    user = await User.get(uid)
    return user


async def verify_and_invalidate_refresh_token(user: User, refresh_token: str):
    rt_doc = await RefreshToken.find_one(RefreshToken.hashed_token == generate_hash(refresh_token))

    if rt_doc is None or rt_doc.user != user or rt_doc.revoked or datetime.now() > rt_doc.expire_at:
        return None
    else:
        rt_doc.revoked = True
        await rt_doc.update()
        return rt_doc


async def generate_refresh_token(user: User, req: Request):
    refresh_token = uuid.uuid4()
    rt_doc = RefreshToken(
        user=user,
        expire_at=datetime.now() + RT_EXPIRE,
        hashed_token=generate_hash(str(refresh_token)),

        ip_addr=req.client.host,
        user_agent=req.headers.get('User-Agent', 'Unknown'),
    )
    await rt_doc.save(link_rule=WriteRules.WRITE)
    return refresh_token


async def generate_token_response(req: Request, res: Response, user: User):
    access_token = Auth.create_access_token(uid=str(user.id))
    refresh_token = await generate_refresh_token(user, req)

    res.set_cookie(
        RT_COOKIE_NAME,
        str(refresh_token),
        RT_EXPIRE.seconds,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {
        "access_token": access_token,
        # "refresh_token": refresh_token,
        "token_type":   "bearer"
    }

router = APIRouter()


@router.post('/token', tags=["auth"])
async def login(req: Request, res: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.authenticate(form_data.username, form_data.password)
    if user is None:
        return {"error": "Invalid credentials"}, 400
    return await generate_token_response(req, res, user)


@router.post('/token/refresh', tags=["auth"], dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def refresh(req: Request, res: Response, refreshToken: Annotated[str, Cookie()], user=Auth.CURRENT_SUBJECT):
    user = await user
    rt_doc = await verify_and_invalidate_refresh_token(user, refreshToken)
    if rt_doc is None:
        return {"error": "Invalid or expired refresh token"}, 400
    return await generate_token_response(req, res, user)
