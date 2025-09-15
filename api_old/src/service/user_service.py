from pydantic import EmailStr

from model.user_model import User
from service.util import verify_passlib_hash


async def get_user_by_id(user_id: str):
    return await User.get(user_id)

async def authenticate(email: EmailStr, pwd: str):
    user = await User.find_one(User.email == email)
    if user and verify_passlib_hash(pwd, user.pwd):
        return user
    return None
