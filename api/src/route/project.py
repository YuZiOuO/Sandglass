from fastapi import APIRouter, Depends

from module.auth import oauth2_scheme, Auth
from module.project import Project

router = APIRouter()

@router.get('/proj',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def get_proj_by_id(proj_id: str):
    return await Project.get(proj_id)

@router.post('/proj',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def create_proj(proj:Project):
    user = Auth.CURRENT_SUBJECT
    return Project(**proj,owner=user).save()

@router.delete('/proj',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def delete_proj(proj_id: str):
    user = Auth.CURRENT_SUBJECT
    p = await Project.get(proj_id)
    if p and p.owner == user:
        return p.delete(), 204