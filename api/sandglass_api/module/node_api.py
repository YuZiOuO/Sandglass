from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from mongoengine import FieldDoesNotExist, ValidationError

from sandglass_api.models.node import Node
from sandglass_api.models.project import Project
from sandglass_api.util import transaction, dereference

node_api = Blueprint('node_api', __name__)


@node_api.get('/node/<string:node_id>')
@jwt_required()
def get_node_by_id(node_id: str):
    """
    Get node with given id.

    SPECIAL STATUS CODES:
    200 - Node found and returned.
    400 - Invalid node id format.
    404 - Node with given id not found.
    """
    try:
        n = Node.objects().with_id(node_id)
    except ValidationError:
        return 'Invalid node id format.', 400
    if not n:
        return 'Node with given id not found.', 404
    return n.to_json()


@node_api.get('/proj/<string:proj_id>/node')
@jwt_required()
def get_nodes_by_proj(proj_id: str):
    """
    Get nodes of a project.

    SPECIAL STATUS CODES:
    200 - Nodes found and returned.
    400 - Invalid project id format.
    404 - Project with given id not found.
    """
    try:
        p: Project = Project.objects().with_id(proj_id)
    except ValidationError:
        return 'Invalid project id format.', 400
    if not p:
        return 'Project with given id not found.', 404
    select_related: bool = request.args.get('select_related', False, bool)
    if select_related:
        return dereference(p.nodes, dump=True)
    else:
        result = dereference(p.nodes)
        return


@node_api.post('/proj/<string:proj_id>/node')
@jwt_required()
def create_node_by_proj(proj_id: str):
    """
    Create a new node in a project.

    SPECIAL STATUS CODES:
    201 - Node created successfully.
    400 - An invalid field was passed, or the project id is invalid, or missing required fields.
    404 - Project with given id not found.
    """
    try:
        p: Project = Project.objects().with_id(proj_id)
    except ValidationError:
        return 'Invalid project id format.', 400
    if not p:
        return 'Project with given id not found.', 404
    @transaction
    def create_task():
        n = Node(owner=current_user, **request.json)
        n.save()
        p.nodes.append(n.id)
        p.save()
        return str(n.id)

    try:
        id_if_created = create_task()
    except FieldDoesNotExist as e:
        return f'Invalid field name.{e}', 400
    except ValidationError as e:
        return f'Fields validation error.{e}', 400

    return id_if_created, 201


@node_api.get('/node')
@jwt_required()
def get_unfinished_nodes_by_current_user():
    """
    Get all unfinished nodes of the current user.

    STATUS CODES:
    200 - Nodes found and returned.
    """
    nodes = Node.objects(owner=current_user, finished=False)
    select_related: bool = request.args.get('select_related', False, bool)
    return nodes.tasks.to_json() if select_related else nodes.tasks.only('id').to_json()


@node_api.delete('/node/<string:node_id>')
@jwt_required()
def delete_node_by_id(node_id: str):
    """
    Delete node with given id.

    SPECIAL STATUS CODES:
    204 - Node deleted successfully.
    400 - Invalid node id.
    404 - Node with given id not found.
    """
    try:
        n = Node.objects().with_id(node_id)
    except ValidationError:
        return 'Invalid node id.', 400
    if not n:
        return 'Node with given id not found.', 404
    n.delete()
    return 'Node deleted.', 204
