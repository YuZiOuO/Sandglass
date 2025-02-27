from flask import Flask

from flask_cors import CORS

from sandglass_api.db import initialize
from sandglass_api.module.session_api import session_api

app = Flask(__name__)
app.register_blueprint(session_api)

initialize()
CORS(app) #测试时允许跨域

if __name__ == '__main__':
    app.run(debug=True)