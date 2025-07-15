from datetime import datetime

from beanie import Document, Link
from pydantic import HttpUrl

from module.attachments import Attachment
from module.node import Node
from module.user import UserInDB


class Project(Document):
    name:str
    owner:Link[UserInDB]
    urls:dict[str,HttpUrl]
    description:str
    start_timestamp:datetime
    end_timestamp:datetime
    nodes:list[Link[Node]]
    attachments:list[Link[Attachment]]