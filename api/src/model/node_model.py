from datetime import datetime

from beanie import Document, Link
from pydantic import HttpUrl, BaseModel

from model.attachments_model import Attachment


class NodeDTO(BaseModel):
    name:str
    timestamp:datetime
    finished:bool
    start_timestamp:datetime # if a node has a start timestamp, it represents a task
    attachment:list[Link[Attachment]]
    description:str
    url:HttpUrl

class Node(Document,NodeDTO):
    pass

