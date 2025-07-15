from datetime import datetime

from beanie import Document, Link
from pydantic import HttpUrl

from module.attachments import Attachment


class Node(Document):
    name:str
    timestamp:datetime
    finished:bool
    start_timestamp:datetime # if a node has a start timestamp, it represents a task
    attachment:list[Link[Attachment]]
    description:str
    url:HttpUrl

