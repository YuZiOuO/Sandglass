import json
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user

from sandglass_api.models.access_control import AccessControlList, AccessControlEntry, Permission
from sandglass_api.models.project import Project
from sandglass_api.module.auth_util import authentication

project_api = Blueprint('project_api', __name__)


@project_api.get('/proj')
@jwt_required()
@authentication
def get_all_proj():
    return "Not Implemented"


@project_api.get('/proj/<string:proj_id>')
@jwt_required()
def get_proj_by_id(proj_id: str):
    p: Project = Project.objects(id=proj_id).first()
    serialized: dict = json.loads(p.to_json())
    return dict(filter(lambda x: not x[0].startswith('_'), serialized.items()))


@project_api.post('/proj')
@jwt_required()
def create_proj():
    parser = {
        'start_timestamp': lambda x: datetime.fromtimestamp(float(x)),
        'end_timestamp': lambda x: datetime.fromtimestamp(float(x)),
        'avatarUrl': lambda x: x if x else None,
        'task': lambda x: x if x else None,
    }
    parsed_req = {k: (parser[k](v) if k in parser else v) for k, v in request.json.items()}

    acl = AccessControlList(
        ACEs=[AccessControlEntry(user=current_user,
                                 permissions=Permission.WRITE)]
    ).save()
    p = Project(ACL=acl, **parsed_req).save()
    return str(p.id)


@project_api.get('/user/<string:user_id>/proj')
@jwt_required()
def get_proj_by_user(user_id: str):
    # TODO
    return "Not Implemented"
