from datetime import datetime

from beanie import Document, Link
from fastapi import APIRouter
from pydantic import HttpUrl

from module.attachments import Attachment
from module.node import Node
from module.user import UserInDB

router = APIRouter()

class Project(Document):
    name:str
    owner:Link[UserInDB]
    urls:dict[str,HttpUrl]
    description:str
    start_timestamp:datetime
    end_timestamp:datetime
    nodes:list[Link[Node]]
    attachments = list[Link[Attachment]]

@router.get('/proj')
# def get_proj_by_current_user():
#     """
#     Get projects owned by the current user.
#
#     STATUS CODES:
#     200 - Success.
#     """
#     select_related: bool = request.args.get('select_related', False, bool)
#     proj: QuerySet = Project.objects(owner=current_user)
#     return proj.to_json() if select_related else proj.only('id').to_json()

@router.get('/proj')
async def get_proj_by_id(proj_id: str):
    return Project.get(proj_id)

@router.post('/proj')
def create_proj():
    try:
        p = Project(owner=current_user, **request.json).save(cascade=True)
    except FieldDoesNotExist as e:
        return str(e), 400
    return str(p.id), 201

@project_api.delete('/proj/<string:proj_id>')
@jwt_required()
def delete_proj(proj_id: str):
    """
    Delete project with given id.

    STATUS CODES:
    204 - Project deleted.
    400 - Invalid id format.
    404 - Project with given id not found.
    """
    result, code = abstract_get_proj_by_id(proj_id)
    if code != 200:
        return result, code
    result.delete()
    return b'', 204