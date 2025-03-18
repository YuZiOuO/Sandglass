from flask import Blueprint
from flask_jwt_extended import jwt_required

task_api = Blueprint('task_api', __name__)


@task_api.get('/task/<str:task_id>')
@jwt_required()
def get_task_by_id(task_id):
    return "Not Implemented"


@task_api.get('/proj/<str:proj_id>/task')
@jwt_required()
def get_tasks_by_proj():
    return "Not Implemented"


@task_api.post('/proj/<str:proj_id>/task')
@jwt_required()
def create_task_by_proj():
    return "Not Implemented"


@task_api.get('/task')
@jwt_required()
def get_unfinished_tasks_by_current_user():
    return "Not Implemented"
