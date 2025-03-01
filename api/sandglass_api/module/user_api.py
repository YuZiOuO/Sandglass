from uuid import UUID, uuid4

from flask import Blueprint, request
from mongoengine import QuerySet

from sandglass_api.models.user import User
from sandglass_api.util import salting

user_api = Blueprint('user_api', __name__)


@user_api.route('/user', methods=['GET'])
def list_user():
    return User.objects().to_json()


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
