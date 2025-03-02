from uuid import UUID, uuid4

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from mongoengine import QuerySet

from sandglass_api.models.user import User
from sandglass_api.util import salting

user_api = Blueprint('user_api', __name__)


@user_api.route('/user', methods=['GET'])
@jwt_required()
def get_user_info():
    # TODO:查询当前用户信息
    return "OK"


@user_api.route('/user', methods=['POST'])
def signup():
    req = request.json

    requested_email = req['email']
    requested_pwd = req['pwd']

    query_set: QuerySet = User.objects(email=requested_email)
    user: User = query_set.first()

    if user is None:
        # TODO:邮件验证
        salt: UUID = uuid4()
        user = User(email=requested_email, pwd_salt=salt, pwd=salting(requested_pwd, salt.hex))
        user.save()
    return "Registration confirmation sent", 200
