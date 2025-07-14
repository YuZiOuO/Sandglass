from datetime import datetime

from beanie import Document
from fastapi import APIRouter
from fastapi.params import Security
from pydantic import EmailStr, HttpUrl, SecretBytes

from util import verify_pwd, get_pwd_hash


class UserBase(Document):
    email:EmailStr
    signup_timestamp:datetime
    administrator:bool

    nickname:str
    avatar_url:HttpUrl

class UserInDB(UserBase):
    pwd: SecretBytes

    @classmethod
    async def authenticate(cls, email: EmailStr, pwd: str):
        user = await cls.find_one(cls.email == email)
        if user and verify_pwd(pwd,user.pwd):
            return user
        return None

class UserIn(UserBase):
    pwd: str

class UserOut(UserBase):
    pass

from module.auth import Auth
router = APIRouter()

@router.get('/user/me',dependencies=[Security(Auth.access_token_required)])
async def get_current_user(subject = Auth.CURRENT_SUBJECT):
    return UserOut(**subject)

@router.post('/user')
async def signup(UserInfo: UserIn):
    user = await UserBase.find_one(UserBase.email == UserInfo.email)
    if user is None:
        # TODO:邮件验证
        user = UserInDB(**UserInfo,pwd=get_pwd_hash(UserInfo.pwd))
        user.save()
    return "Registration confirmation sent."
