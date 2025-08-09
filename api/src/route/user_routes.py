from fastapi import APIRouter, Depends

from model.user_model import UserOutDTO, UserInDTO, User
from route.util import AuthError
from service.auth_service import oauth2_scheme, Auth
from service.util import generate_passlib_hash

router = APIRouter()


@router.get(
    '/user/me',
    dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED],
    responses={
        401: AuthError
    }
)
async def get_current_user(subject = Auth.CURRENT_SUBJECT):
    user = await subject
    return UserOutDTO(**user.model_dump())

@router.post('/user')
async def signup(UserInfo: UserInDTO):
    user = await User.find_one(User.email == UserInfo.email)
    if user is None:
        # TODO:邮件验证
        user = User(**UserInfo.model_dump(exclude={"pwd"}), pwd=generate_passlib_hash(UserInfo.pwd))
        await user.save()
    return "Registration confirmation sent."
