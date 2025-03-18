from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from mongoengine import QuerySet, FieldDoesNotExist, ValidationError

from sandglass_api.models.project import Project

project_api = Blueprint('project_api', __name__)


@project_api.get('/proj')
@jwt_required()
def get_proj_by_current_user():
    """
    Get projects owned by the current user.
    """
    select_related: bool = request.args.get('select_related', False, bool)
    proj: QuerySet = Project.objects(owner=current_user)
    return proj.to_json() if select_related else proj.only('id').to_json()

@project_api.get('/proj/<string:proj_id>')
@jwt_required()
def get_proj_by_id(proj_id: str):
    """
    Get project with given id.

    SPECIAL STATUS CODES:
    404 - Project with given id not found.
    400 - Invalid id format.
    """
    try:
        p: Project = Project.objects().with_id(proj_id)
        if not p:
            return 'Project with given id not found.', 404
    except ValidationError:
        return 'Invalid id format.', 400
    return p.to_json()

@project_api.post('/proj')
@jwt_required()
def create_proj():
    """
    Create a new project.

    SPECIAL STATUS CODES:
    400 - An invalid field was passed.
    """
    try:
        p = Project(owner=current_user, **request.json).save(cascade=True)
    except FieldDoesNotExist as e:
        return f'Invalid field name.{e}', 400
    return str(p.id)


@project_api.delete('/proj/<string:proj_id>')
@jwt_required()
def delete_proj(proj_id: str):
    """
    Delete project with given id.

    SPECIAL STATUS CODES:
    404 - Project with given id not found.
    400 - Invalid id format.
    """
    try:
        p: Project = Project.objects().with_id(proj_id)
        if not p:
            return 'Project with given id not found.', 404
    except ValidationError:
        return 'Invalid id format.', 400

    p.delete()
    return 'Project deleted.'
