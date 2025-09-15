from http import HTTPStatus

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from starlette.requests import Request
from starlette.responses import JSONResponse

from model.auth_model import TokenResponse
from route.util import AuthError
from service.auth_service import Auth, oauth2_scheme, generate_access_token, generate_refresh_token, \
    verify_refresh_token, invalidate_refresh_token
from service.user_service import authenticate, get_user_by_id

router = APIRouter()


@router.post(
    '/token',
    response_model=TokenResponse,
    responses={
        401: {
            "model":       None,
            "description": "Incorrect username or password"
        },
    }
)
async def login(req: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate(form_data.username, form_data.password)
    if user is None:
        return JSONResponse(status_code=HTTPStatus.UNAUTHORIZED, content={"msg": "Incorrect username or password"})

    access_token = await generate_access_token(user)
    refresh_token = await generate_refresh_token(user, req.client.host, req.headers.get("User-Agent"))

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "bearer"
    }


@router.post(
    '/token/refresh',
    response_model=TokenResponse,
    dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED],
    status_code=HTTPStatus.CREATED,
    responses={
        401: AuthError,
    }
)
async def refresh(req: Request, refreshToken: str, user_id=Auth.CURRENT_SUBJECT):
    user = await get_user_by_id(user_id)

    verify_result = await verify_refresh_token(user, refreshToken)
    if not verify_result:
        return JSONResponse(status_code=HTTPStatus.UNAUTHORIZED, content={"msg": "Invalid refresh token."})

    await invalidate_refresh_token(verify_result)

    refresh_token = await generate_refresh_token(user, req.client.host, req.headers.get("User-Agent"))
    access_token = await generate_access_token(user)

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "bearer"
    }
