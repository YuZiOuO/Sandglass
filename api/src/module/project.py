from datetime import datetime
from typing import List

from beanie import Document, Link
from pydantic import HttpUrl, BaseModel

from module.attachments import Attachment
from module.node import Node
from module.user import User


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