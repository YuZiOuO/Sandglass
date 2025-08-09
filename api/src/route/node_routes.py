from beanie import WriteRules
from fastapi import APIRouter, Depends

from model.node_model import NodeDTO, Node
from model.project_model import Project
from service.auth_service import oauth2_scheme, Auth

router = APIRouter()


@router.get('/node/{node_id}', dependencies=[Depends(oauth2_scheme)])
async def get_node_by_id(node_id: str):
    return await Node.get(node_id)


@router.get('/proj/{proj_id}/node', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def get_node_by_proj(proj_id: str):
    return await Node.find(NodeDTO.proj_id == proj_id).to_list()


@router.post('/proj/{proj_id}/node', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def create_node(proj_id: str, node: NodeDTO):
    # TODO: Transaction management
    proj = await Project.get(proj_id)
    node_to_db = Node(**node.model_dump(), proj_id=proj_id)
    proj.nodes.append(node_to_db)
    await proj.save(link_rule=WriteRules.WRITE)
    return node


@router.delete('/node/{node_id}', dependencies=[Depends(oauth2_scheme), Auth.ACCESS_REQUIRED])
async def delete_node(node_id: str):
    node = await NodeDTO.get(node_id)
    return await node.delete()
