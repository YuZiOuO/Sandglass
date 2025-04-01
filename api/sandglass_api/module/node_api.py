import flask
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from mongoengine import FieldDoesNotExist, ValidationError

from sandglass_api.models.node import Node
from sandglass_api.module.project_api import abstract_get_proj_by_id
from sandglass_api.util import transaction

node_api = Blueprint('node_api', __name__)

def abstract_get_node_by_id(node_id: str):
    try:
        n = Node.objects().with_id(node_id)
    except ValidationError as e:
        return str(e), 400
    if not n:
        flask.abort(404)
    return n, 200

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
    n, code = abstract_get_node_by_id(node_id)
    return n.to_json() if code == 200 else n, code if n is not None else code

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
    p, code = abstract_get_proj_by_id(proj_id)
    if code != 200:
        return p, code
    select_related: bool = request.args.get('select_related', False, bool)
    if select_related:
        return map(lambda n: n.to_json(), p.nodes)
    else:
        return list(map(lambda n: n.to_json(), p.nodes))

@node_api.post('/proj/<string:proj_id>/node')
@jwt_required()
def create_node(proj_id: str):
    """
    Create a new node in a project.

    SPECIAL STATUS CODES:
    201 - Node created successfully.
    400 - An invalid field was passed, or the project id is invalid, or missing required fields.
    404 - Project with given id not found.
    """
    p, code = abstract_get_proj_by_id(proj_id)
    if code != 200:
        return p, code
    @transaction
    def create_node_transaction():
        n = Node(**request.json)
        n.save()
        p.nodes.append(n.id)
        p.save()
        return str(n.id)
    try:
        id_if_created = create_node_transaction()
    except FieldDoesNotExist as e:
        return str(e), 400
    except ValidationError as e:
        return str(e), 400
    return id_if_created, 201


# pending:against api invariant
# @node_api.get('/node')
# @jwt_required()
# def get_unfinished_nodes_by_current_user():
#     """
#     Get all unfinished nodes of the current user.
#
#     STATUS CODES:
#     200 - Nodes found and returned.
#     """
#     nodes = Node.objects(owner=current_user, finished=False)
#     select_related: bool = request.args.get('select_related', False, bool)
#     return nodes.tasks.to_json() if select_related else nodes.tasks.only('id').to_json()

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
    n, code = abstract_get_node_by_id(node_id)
    if code != 200:
        return n, code
    n.delete()
    return 'Node deleted.', 204
