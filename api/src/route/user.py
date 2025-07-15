from fastapi import APIRouter, Depends

from module.auth import oauth2_scheme, Auth
from module.user import UserOut, UserIn, UserBase, UserInDB
from util import get_pwd_hash

router = APIRouter()

@router.get('/user/me', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def get_current_user(subject = Auth.CURRENT_SUBJECT):
    return UserOut(**subject)

@router.post('/user')
async def signup(UserInfo: UserIn):
    user = await UserBase.find_one(UserBase.email == UserInfo.email)
    if user is None:
        # TODO:邮件验证
        user = UserInDB(**UserInfo.dict(),pwd=get_pwd_hash(UserInfo.pwd))
        user.save()
    return "Registration confirmation sent."
