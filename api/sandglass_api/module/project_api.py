from flask import Blueprint
from flask_jwt_extended import jwt_required

from sandglass_api.models.project import Project

project_api = Blueprint('project_api', __name__)


@project_api.get('/proj')
@jwt_required()
def list_proj():
    # TODO:权限验证
    return Project.objects()

# @project_api.get('/user_id/proj')
# @jwt_required
# def list_user_proj(user_id:str):
#     pass
