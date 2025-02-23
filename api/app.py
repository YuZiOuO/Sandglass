from dataclasses import asdict

from flask import Flask, jsonify
from flask_cors import CORS

from models import Project, Task

app = Flask(__name__)
CORS(app) #测试时允许跨域

@app.route('/', methods=['GET'])
def hello_world():
    return {'message': 'Hello, World!'}

@app.route('/proj', methods=['GET'])
def get_proj():
    task1 = Task(taskName='task1')
    task2 = Task(taskName='task2',deadline='2018-01-03T00:00:00Z')
    task3 = Task(taskName='task3', deadline='2018-01-04T00:00:00Z')
    proj = Project(tasks=[task1,task2,task3])
    return asdict(proj)

# @app.route('/login',method=['POST'])
# def login():
#         pass

if __name__ == '__main__':
    app.run(debug=True)