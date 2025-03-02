from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import QuerySet

from sandglass_api.config import FlaskConfig, DB_DATABASE_NAME, DB_URI
from sandglass_api.db import connect_to
from sandglass_api.models.user import User
from sandglass_api.module.auth_api import auth_api
from sandglass_api.module.project_api import project_api
from sandglass_api.module.user_api import user_api


def create_app(db_uri: str, db_name: str):
    app = Flask(__name__)
    app.config.from_object(FlaskConfig)

    jwt = JWTManager(app)

    # register callback func to create jwt from user obj.
    @jwt.user_identity_loader
    def get_user_id(user: User):
        return str(user.id)

    # register callback func to query user obj from jwt.
    @jwt.user_lookup_loader
    def get_user_by_id(_jwt_header, jwt_data) -> User | None:
        query_set: QuerySet = User.objects(id=jwt_data["sub"])
        user: User = query_set.first()
        return user

    app.register_blueprint(auth_api)
    app.register_blueprint(user_api)
    app.register_blueprint(project_api)

    connect_to(db_uri, db_name)
    CORS(app)  # 测试时允许跨域

    return app


if __name__ == '__main__':
    create_app(DB_URI, DB_DATABASE_NAME).run()
