from datetime import datetime
from typing import List

from beanie import Document, Link
from pydantic import HttpUrl, BaseModel

from model.attachments_model import Attachment
from model.node_model import Node
from model.user_model import User


class ProjectBase(BaseModel):
    name: str
    urls: dict[str, HttpUrl]
    description: str
    start_timestamp: datetime
    end_timestamp: datetime

class Project(Document, ProjectBase):
    owner: Link[User]
    nodes: List[Link[Node]] = []
    attachments: List[Link[Attachment]] = []