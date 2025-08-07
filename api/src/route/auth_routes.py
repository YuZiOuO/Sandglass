from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from starlette.requests import Request

from service.auth_service import Auth, oauth2_scheme, generate_access_token, generate_refresh_token, \
    verify_refresh_token, invalidate_refresh_token
from service.user_service import authenticate

router = APIRouter()


@router.post('/token', tags=["auth"])
async def login(req: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate(form_data.username, form_data.password)
    if user is None:
        return {"error": "Invalid credentials"}, 400

    access_token = await generate_access_token(user)
    refresh_token = await generate_refresh_token(user, req.client.host, req.headers.get("User-Agent"))

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "bearer"
    }


@router.post('/token/refresh', tags=["auth"], dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def refresh(req: Request, refreshToken: str, user=Auth.CURRENT_SUBJECT):
    user = await user

    verify_result = await verify_refresh_token(user, refreshToken)
    if not verify_result:
        return {"error": "Invalid or expired refresh token"}, 400

    await invalidate_refresh_token(verify_result)

    refresh_token = await generate_refresh_token(user, req.client.host, req.headers.get("User-Agent"))
    access_token = await generate_access_token(user)

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "bearer"
    }
