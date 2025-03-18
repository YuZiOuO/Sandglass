from flask import Blueprint, request
from flask_jwt_extended import jwt_required

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
        return 'Project with given id not found', 404
    return p.nodes.to_json()


@node_api.post('/proj/<str:proj_id>/node')
@jwt_required()
def create_task_by_proj(proj_id: str):
    p: Project = Project.objects().with_id(proj_id)
    if not p:
        return 'Project with given id not found', 404

    @transaction
    def create_node():
        n = Node(**request.json)
        n.save()
        p.nodes.append(n)
        p.save()
        return str(n.id)

    return create_node()


@node_api.get('/node')
@jwt_required()
def get_unfinished_nodes_by_current_user():
    return "Not Implemented"
