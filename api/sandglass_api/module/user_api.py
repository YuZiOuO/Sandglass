from uuid import UUID, uuid4

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from mongoengine import QuerySet

from sandglass_api.models.user import User
from sandglass_api.module.auth_util import authentication
from sandglass_api.util import salting

user_api = Blueprint('user_api', __name__)

@user_api.route('/user', methods=['GET'])
@jwt_required()
@authentication
def get_all_user():
    return "Not Implemented"


@user_api.route('/user/<string:user_id>')
@jwt_required()
def get_user_by_id(user_id: str):
    return "Not Implemented"


@user_api.patch('/user/<string:user_id>')
@jwt_required()
def modify_user_info(user_id: str):
    return "Not Implemented"

@user_api.route('/user', methods=['POST'])
def signup():
    """
    Create a new user.
    Always return Accepted to prevent email enumeration.

    STATUS CODE:
    202 - Registration confirmation sent.
    """
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
    return "Registration confirmation sent.", 202
