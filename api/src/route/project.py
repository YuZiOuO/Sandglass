from fastapi import APIRouter, Depends

from module.auth import oauth2_scheme, Auth
from module.project import Project, ProjectBase

router = APIRouter()


@router.get('/proj', dependencies=[Depends(oauth2_scheme)])
async def get_proj_by_id(proj_id: str, token=Auth.ACCESS_REQUIRED) -> ProjectBase:
    return await Project.get(proj_id)


@router.post('/proj', dependencies=[Depends(oauth2_scheme)])
async def create_proj(proj: ProjectBase, user=Auth.CURRENT_SUBJECT, token=Auth.ACCESS_REQUIRED):
    await Project(**proj.model_dump(),owner=(await user).id).save()


@router.delete('/proj', dependencies=[Depends(oauth2_scheme)])
async def delete_proj(proj_id: str, token=Auth.ACCESS_REQUIRED):
    user = Auth.CURRENT_SUBJECT
    p = await Project.get(proj_id)
    if p and p.owner == user:
        return p.delete(), 204