from datetime import datetime

from beanie import Document
from pydantic import EmailStr, HttpUrl, BaseModel

from util import verify_hash


class UserBaseDTO(BaseModel):
    email:EmailStr
    signup_timestamp:datetime
    administrator:bool

    nickname:str
    avatar_url:HttpUrl

class User(Document, UserBaseDTO):
    pwd: str

    @classmethod
    async def authenticate(cls, email: EmailStr, pwd: str):
        user = await cls.find_one(cls.email == email)
        if user and verify_hash(pwd, user.pwd):
            return user
        return None

class UserInDTO(UserBaseDTO):
    pwd: str

class UserOutDTO(UserBaseDTO):
    pass

