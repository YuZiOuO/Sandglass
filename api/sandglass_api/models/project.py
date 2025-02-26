from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum

from pymongo.results import InsertOneResult
from pymongo.synchronous.database import Database

from sandglass_api.env import DB_PROJECT_COLLECTION_NAME
from sandglass_api.models.tasks import Task

class Status(str,Enum):
    NOT_STARTED = 'NOT_STARTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    ON_HOLD = 'ON_HOLD'

@dataclass
class Project:
    projName:str
    avatarUrl:str
    description:str
    #_id: str | None = None
    startTimestamp:datetime = field(default_factory=lambda:datetime.now()) # FIXME:使用默认工厂函数,而不是now()
    endTimestamp:datetime = field(default_factory=lambda:datetime.now())
    status:Status = field(default_factory=lambda:Status(Status.NOT_STARTED))
    tasks:list[Task] = field(default_factory=list)

    def db_insert(self,db:Database) -> InsertOneResult:
        c = db.get_collection(DB_PROJECT_COLLECTION_NAME)
        return c.insert_one(asdict(self))
