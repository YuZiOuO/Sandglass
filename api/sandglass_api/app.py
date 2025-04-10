from flask import Flask
from flask_jwt_extended import jwt_required

from sandglass_api.config import FlaskConfig, DB_DATABASE_NAME, DB_URI
from sandglass_api.db import connect_to
from sandglass_api.middleware.jwt_module import register_jwt_module_to
from sandglass_api.module.attachment_api import attachment_api
from sandglass_api.module.auth_api import auth_api
from sandglass_api.module.node_api import node_api
from sandglass_api.module.project_api import project_api
from sandglass_api.module.user_api import user_api


def create_app(db_uri: str, db_name: str):
    app = Flask(__name__)
    app.config.from_object(FlaskConfig)
    register_jwt_module_to(app)

    # This is a test interface,only valid when "TESTING"==True
    @app.get('/')
    @jwt_required()
    def hello_world():
        if app.config["TESTING"] is not True:
            return 403
        return "Hello,world!"

    app.register_blueprint(auth_api)
    app.register_blueprint(user_api)
    app.register_blueprint(project_api)
    app.register_blueprint(node_api)
    app.register_blueprint(attachment_api)

    connect_to(db_uri, db_name)

    return app

if __name__ == '__main__':
    create_app(DB_URI, DB_DATABASE_NAME).run()
