from datetime import datetime

from flask import Flask
from flask_jwt_extended import JWTManager, jwt_required, get_jwt, create_access_token, \
    set_access_cookies, current_user

from sandglass_api.config import FlaskConfig, DB_DATABASE_NAME, DB_URI, JWT_EXPIRE_TIME, JWT_REFRESH_FACTOR
from sandglass_api.db import connect_to
from sandglass_api.models.user import User
from sandglass_api.module.auth_api import auth_api
from sandglass_api.module.node_api import node_api
from sandglass_api.module.project_api import project_api
from sandglass_api.module.user_api import user_api


def create_app(db_uri: str, db_name: str):
    app = Flask(__name__)
    app.config.from_object(FlaskConfig)

    jwt = JWTManager(app)
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]

    # register callback func to create jwt from user obj.
    @jwt.user_identity_loader
    def get_user_id(user: User):
        return str(user.id)

    # register callback func to query user obj from jwt.
    @jwt.user_lookup_loader
    def get_user_by_id(_jwt_header, jwt_data) -> User | None:
        user = User.objects.with_id(jwt_data["sub"])
        return user

    # This is a test interface,only valid when "TESTING"==True
    @app.get('/')
    @jwt_required()
    def hello_world():
        if app.config["TESTING"] is not True:
            return 403
        return "Hello,world!"

    # This function must be registered here otherwise
    # it will only be executed after request handled by blueprint
    @app.after_request
    def refresh_jwt(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            target = exp_timestamp - JWT_EXPIRE_TIME * (1 - JWT_REFRESH_FACTOR)
            if datetime.now().timestamp() > target:
                access_token = create_access_token(identity=current_user)
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            return response

    app.register_blueprint(auth_api)
    app.register_blueprint(user_api)
    app.register_blueprint(project_api)
    app.register_blueprint(node_api)

    connect_to(db_uri, db_name)

    return app


if __name__ == '__main__':
    create_app(DB_URI, DB_DATABASE_NAME).run()
