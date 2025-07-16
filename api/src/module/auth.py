from authx import AuthXConfig, AuthX
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from module.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')

config = AuthXConfig()
config.JWT_ALGORITHM = "HS256"
config.JWT_SECRET_KEY = "<SECRET_KEY_HERE>"
Auth = AuthX(config = config, model = User)

@Auth.set_subject_getter
async def get_current_user(uid:str):
    user = await User.get(uid)
    return user

router = APIRouter()

@router.post('/token')
async def login(form_data:OAuth2PasswordRequestForm = Depends()):
    user = await User.authenticate(form_data.username, form_data.password)
    if user is None:
        return {"error": "Invalid credentials"}, 400
    access_token = Auth.create_access_token(uid = str(user.id))
    refresh_token = Auth.create_refresh_token(uid = str(user.id))
    return {"access_token":  access_token,
            "refresh_token": refresh_token,
            "token_type":    "bearer"}
