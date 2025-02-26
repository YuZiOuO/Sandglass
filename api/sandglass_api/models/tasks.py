from dataclasses import dataclass, asdict

from pymongo.results import InsertOneResult
from pymongo.synchronous.database import Database

from sandglass_api.env import DB_TASK_COLLECTION_NAME


@dataclass
class Task:
    taskName: str
    deadline: str
    status: str  # TODO:more...
    description: str
    _id: str | None = None
    parent_id: str | None = None

    def db_insert(self, db: Database) -> InsertOneResult:
        c = db.get_collection(DB_TASK_COLLECTION_NAME)
        return c.insert_one(asdict(self))
