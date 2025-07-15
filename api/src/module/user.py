from datetime import datetime

from beanie import Document
from pydantic import EmailStr, HttpUrl, SecretBytes

from util import verify_pwd


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

