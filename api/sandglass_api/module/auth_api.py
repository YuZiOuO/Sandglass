from flask import request, Blueprint, jsonify
from flask_jwt_extended import create_access_token
from mongoengine import QuerySet

from sandglass_api.models.user import User
from sandglass_api.util import salting

auth_api = Blueprint('auth_api', __name__)


@auth_api.route('/token', methods=['POST'])
def login():
    req = request.json

    requested_email = req['email']
    requested_pwd = req['pwd']

    query_set: QuerySet = User.objects(email=requested_email)
    user: User = query_set.first()
    if user is not None and user.pwd == salting(requested_pwd, user.pwd_salt.hex):
        access_token = create_access_token(identity=user.to_json())  # TODO:改为传id
        return jsonify(access_token=access_token)
    else:
        return "Invalid Email or Password.", 401
