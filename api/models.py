from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

class Status(str,Enum):
    NOT_STARTED = 'NOT_STARTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    ON_HOLD = 'ON_HOLD'

@dataclass
class Task:
    taskName:str = 'Example task'
    parentUUID:str = 'null'
    UUID:str = '114514'
    deadline:str = '2018-01-01T00:00:00Z'
    status:str = 'completed' # and more...
    description:str = 'example description'

@dataclass
class Project:
    projName:str = 'Example proj'
    UUID:str = '1234567890'
    startTimestamp:datetime = field(default_factory=lambda:datetime.now())
    endTimestamp:datetime = field(default_factory=lambda:datetime.now())
    status:Status = field(default_factory=lambda:Status(Status.NOT_STARTED))
    avatarUrl:str = 'https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg'
    description:str = 'A example proj'
    tasks:list[Task] = field(default_factory=list)




