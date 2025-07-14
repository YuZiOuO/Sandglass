from authx import AuthXConfig, AuthX
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from module.user import UserInDB

config = AuthXConfig()
config.JWT_ALGORITHM = "HS256"
config.JWT_SECRET_KEY = "<SECRET_KEY_HERE>"
Auth = AuthX(config = config)

@Auth.set_subject_getter
async def get_current_user(uid:str):
    return await UserInDB.get(uid)

router = APIRouter()

@router.post('/token')
async def login(form_data:OAuth2PasswordRequestForm = Depends()):
    user = await UserInDB.authenticate(form_data.username, form_data.password)
    if user is None:
        return {"error": "Invalid credentials"}, 400
    return Auth.create_access_token(uid = str(user.id))