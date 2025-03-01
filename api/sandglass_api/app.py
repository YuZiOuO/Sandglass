from flask import Flask
from flask_cors import CORS

from sandglass_api.config import FlaskConfig, DB_DATABASE_NAME, DB_URI
from sandglass_api.db import connect_to
from sandglass_api.module.project_api import project_api
from sandglass_api.module.session_api import session_api
from sandglass_api.module.user_api import user_api


def create_app(db_uri: str, db_name: str):
    app = Flask(__name__)
    app.config.from_object(FlaskConfig)

    app.register_blueprint(session_api)
    app.register_blueprint(user_api)
    app.register_blueprint(project_api)

    connect_to(db_uri, db_name)
    CORS(app)  # 测试时允许跨域

    return app


if __name__ == '__main__':
    create_app(DB_URI, DB_DATABASE_NAME).run()
