from fastapi import APIRouter, Depends, HTTPException, status

from model.project_model import ProjectBase, Project
from service.auth_service import oauth2_scheme, Auth
from service.user_service import get_user_by_id

router = APIRouter()


@router.get('/proj', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def get_proj_by_id(proj_id: str, user_id=Auth.CURRENT_SUBJECT) -> ProjectBase | None:
    user = await get_user_by_id(user_id)
    proj = await Project.get(proj_id)
    return proj if proj and proj.owner == user.id else None


@router.post('/proj', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def create_proj(proj: ProjectBase, user_id=Auth.CURRENT_SUBJECT):
    user = await get_user_by_id(user_id)
    await Project(**proj.model_dump(), owner=(await user).id).save()


@router.delete('/proj', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED],
               status_code=status.HTTP_204_NO_CONTENT)
async def delete_proj(proj_id: str, user_id=Auth.CURRENT_SUBJECT):
    user = await get_user_by_id(user_id)
    p = await Project.get(proj_id)
    if p and p.owner == user:
        await p.delete()
    else:
        raise HTTPException(400)
