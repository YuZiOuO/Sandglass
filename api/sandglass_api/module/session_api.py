from flask import request, Blueprint
from mongoengine import QuerySet

from sandglass_api.models.user import User, Session, SessionStatus
from sandglass_api.util import salting

session_api = Blueprint('session_api',__name__)

@session_api.route('/session',methods=['POST'])
def login():
    req = request.json

    requested_email = req['email']
    requested_pwd = req['pwd']

    query_set:QuerySet = User.objects(email=requested_email)
    user:User = query_set.first()
    if user is not None and user.pwd == salting(requested_pwd,user.pwd_salt):
        user.current_session = Session(user,SessionStatus.VALID)
        return "Logged in."
    else:
        return "Invalid Email or Password."

