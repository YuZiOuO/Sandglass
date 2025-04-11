from datetime import datetime

from flask import Flask
from flask_jwt_extended import JWTManager, get_jwt, create_access_token, current_user, set_access_cookies

from sandglass_api.models.user import User


def register_jwt_module_to(app: Flask):
    jwt = JWTManager(app)

    # register callback func to create jwt from user obj.
    @jwt.user_identity_loader
    def get_user_id(user: User):
        return str(user.id)

    # register callback func to query user obj from jwt.
    @jwt.user_lookup_loader
    def get_user_by_id(_jwt_header, jwt_data) -> User | None:
        user = User.objects.with_id(jwt_data["sub"])
        return user

    # This function must be registered here otherwise
    # it will only be executed after request handled by blueprint
    @app.after_request
    def refresh_jwt(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            target = exp_timestamp - app.config["JWT_EXPIRE_TIME"] * (1 - app.config["JWT_REFRESH_FACTOR"])
            if datetime.now().timestamp() > target:
                access_token = create_access_token(identity=current_user)
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            return response
