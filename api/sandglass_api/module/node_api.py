from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from mongoengine import FieldDoesNotExist

from sandglass_api.models.node import Node
from sandglass_api.models.project import Project
from sandglass_api.util import transaction

node_api = Blueprint('node_api', __name__)


@node_api.get('/node/<str:node_id>')
@jwt_required()
def get_node_by_id(node_id: str):
    n = Node.objects().with_id(node_id)
    if not n:
        return 'Node with given id not found', 404
    return n.to_json()


@node_api.get('/proj/<str:proj_id>/node')
@jwt_required()
def get_nodes_by_proj(proj_id: str):
    p: Project = Project.objects().with_id(proj_id)
    if not p:
        return 'Project with given id not found.', 404
    select_related: bool = request.args.get('select_related', False, bool)
    return p.nodes.to_json() if select_related else p.nodes.only('id').to_json()


@node_api.post('/proj/<str:proj_id>/node')
@jwt_required()
def create_task_by_proj(proj_id: str):
    p: Project = Project.objects().with_id(proj_id)
    if not p:
        return 'Project with given id not found.', 404
    @transaction
    def create_task():
        n = Node(owner=current_user, **request.json)
        n.save()
        p.tasks.append(n)
        p.save()
        return str(n.id)

    try:
        id_if_created = create_task()
    except FieldDoesNotExist as e:
        return f'Invalid field name.{e}', 400

    return id_if_created


@node_api.get('/node')
@jwt_required()
def get_unfinished_nodes_by_current_user():
    nodes = Node.objects(owner=current_user, finished=False)
    select_related: bool = request.args.get('select_related', False, bool)
    return nodes.tasks.to_json() if select_related else nodes.tasks.only('id').to_json()
