from fastapi import APIRouter, Depends

from module.auth import oauth2_scheme, Auth
from module.user import UserOutDTO, UserInDTO, User
from util import get_pwd_hash

router = APIRouter()

@router.get('/user/me', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def get_current_user(subject = Auth.CURRENT_SUBJECT):
    user = await subject
    return UserOutDTO(**user.model_dump())

@router.post('/user')
async def signup(UserInfo: UserInDTO):
    user = await User.find_one(User.email == UserInfo.email)
    if user is None:
        # TODO:邮件验证
        user = User(**UserInfo.model_dump(exclude={"pwd"}), pwd=get_pwd_hash(UserInfo.pwd))
        await user.save()
    return "Registration confirmation sent."
