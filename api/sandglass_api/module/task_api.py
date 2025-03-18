from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from mongoengine import FieldDoesNotExist

from sandglass_api.models.project import Project
from sandglass_api.models.task import Task
from sandglass_api.util import transaction

task_api = Blueprint('task_api', __name__)


@task_api.get('/task/<str:task_id>')
@jwt_required()
def get_task_by_id(task_id: str):
    """
    Get a task by id.

    SPECIAL STATUS CODES:
    404 - Task with given id not found.
    """
    t: Task = Task.objects().with_id(task_id)
    if not t:
        return 'Task with given id not found.', 404
    return t.to_json()


@task_api.get('/proj/<str:proj_id>/task')
@jwt_required()
def get_tasks_by_proj(proj_id: str):
    """
    Get a tasks in given project.

    SPECIAL STATUS CODES:
    404 - Project with given id not found.
    """
    p: Project = Project.objects().with_id(proj_id)
    if not p:
        return 'Project with given id not found.', 404
    select_related: bool = request.args.get('select_related', False, bool)
    return p.tasks.to_json() if select_related else p.tasks.only('id').to_json()


@task_api.post('/proj/<str:proj_id>/task')
@jwt_required()
def create_task_by_proj(proj_id: str):
    """
    Create a task in given project.

    SPECIAL STATUS CODES:
    404 - Project with given id not found.
    """
    p: Project = Project.objects().with_id(proj_id)
    if not p:
        return 'Project with given id not found.', 404

    @transaction
    def create_task():
        t = Task(owner=current_user, **request.json)
        t.save()
        p.tasks.append(t)
        p.save()
        return str(t.id)

    try:
        id_if_created = create_task()
    except FieldDoesNotExist as e:
        return f'Invalid field name.{e}', 400

    return id_if_created

@task_api.get('/task')
@jwt_required()
def get_unfinished_tasks_by_current_user():
    """
    Get unfinished tasks of current user.
    """
    tasks = Task.objects(owner=current_user, finished=False)
    select_related: bool = request.args.get('select_related', False, bool)
    return tasks.tasks.to_json() if select_related else tasks.tasks.only('id').to_json()
