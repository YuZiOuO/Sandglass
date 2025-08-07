import os
import uuid
from datetime import timedelta, datetime
from ipaddress import IPv6Address, IPv4Address
from typing import Optional

from authx import AuthXConfig, AuthX
from beanie import WriteRules
from fastapi.security import OAuth2PasswordBearer

from model.auth_model import RefreshToken
from model.user_model import User
from service.util import generate_hashlib_hash

RT_EXPIRE = timedelta(hours=int(os.getenv("REFRESH_TOKEN_EXPIRE_IN_HOURS")))
RT_COOKIE_NAME = os.getenv("REFRESH_TOKEN_COOKIE_NAME")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')

config = AuthXConfig()
config.JWT_ALGORITHM = "HS256"
config.JWT_SECRET_KEY = "<SECRET_KEY_HERE>"
Auth = AuthX(config = config, model = User)


async def verify_refresh_token(user: User, refresh_token: str) -> Optional[RefreshToken]:
    hashed_token = generate_hashlib_hash(refresh_token)
    rt_doc = await RefreshToken.find_one(RefreshToken.hashed_token == hashed_token, fetch_links=True)
    if rt_doc is None or rt_doc.user != user or rt_doc.revoked or datetime.now() > rt_doc.expire_at:
        return None
    else:
        return rt_doc


async def invalidate_refresh_token(refresh_token: RefreshToken):
    # Assert that the refresh token is valid
    refresh_token.revoked = True
    await refresh_token.save()


async def generate_refresh_token(user: User, ip_addr: Optional[IPv4Address | IPv6Address | str], user_agent: str):
    refresh_token = uuid.uuid4()
    rt_doc = RefreshToken(
        user=user,
        expire_at=datetime.now() + RT_EXPIRE,
        hashed_token=generate_hashlib_hash(str(refresh_token)),

        ip_addr=ip_addr,
        user_agent=user_agent,
    )
    await rt_doc.save(link_rule=WriteRules.WRITE)
    return str(refresh_token)


async def generate_access_token(user: User):
    return Auth.create_access_token(uid=str(user.id))


@Auth.set_subject_getter
async def get_current_user(uid: str):
    user = await User.get(uid)
    return user
