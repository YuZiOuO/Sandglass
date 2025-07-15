from fastapi import APIRouter, Depends

from module.auth import oauth2_scheme, Auth
from module.node import Node

router = APIRouter()

@router.get('/node/{node_id}',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def get_node_by_id(node_id:str):
    return await Node.get(node_id)

@router.get('/proj/{proj_id}/node',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def get_node_by_proj(proj_id:str):
    return await Node.find(Node.proj_id == proj_id).to_list()

@router.post('/proj/{proj_id}/node',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def create_node(proj_id:str, node:Node):
    # TODO: Transaction management
    node.proj_id = proj_id
    proj = await Project.get(proj_id)
    await node.insert()
    proj.nodes.append(node)
    await proj.save()
    return node

@router.delete('/node/{node_id}',dependencies=[Depends(oauth2_scheme),Auth.ACCESS_REQUIRED])
async def delete_node(node_id: str):
    node = await Node.get(node_id)
    return await node.delete()