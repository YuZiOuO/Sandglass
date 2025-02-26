from flask import Flask, request
from flask_cors import CORS

from db import initialize
from env import DB_DATABASE_NAME
from sandglass_api.models.user import User
from tests.example_obj import example_proj

app = Flask(__name__)
db = initialize().get_database(DB_DATABASE_NAME)
CORS(app) #测试时允许跨域

@app.route('/', methods=['GET'])
def hello_world():
    return {'message': 'Hello, World!'}

@app.get('/proj')
def get_proj():
    pass

@app.post('/proj')
def add_proj():
    p = example_proj
    return str(p.db_insert(db).inserted_id)

@app.get('/user')
def login():
    pass

@app.post('/user')
def signup():
    u = User(**request.__dict__)

    i_id = u.db_insert(db).inserted_id
    return str(i_id)

if __name__ == '__main__':
    app.run(debug=True)