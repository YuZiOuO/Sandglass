from datetime import datetime

from beanie import Document
from pydantic import EmailStr, HttpUrl, BaseModel


class UserBaseDTO(BaseModel):
    email:EmailStr
    signup_timestamp:datetime
    administrator:bool

    nickname:str
    avatar_url:HttpUrl

class User(Document, UserBaseDTO):
    pwd: str

class UserInDTO(UserBaseDTO):
    pwd: str

class UserOutDTO(UserBaseDTO):
    pass

