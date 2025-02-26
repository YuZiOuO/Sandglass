from dataclasses import dataclass, asdict, field
from datetime import datetime
from uuid import uuid4

from pymongo.results import InsertOneResult
from pymongo.synchronous.database import Database

from sandglass_api.env import DB_USER_COLLECTION_NAME


@dataclass
class User:
    nickname: str
    email: str
    pwd: str
    avatarUrl: str = ""
    pwd_salt: uuid4 = field(default_factory=lambda: uuid4())
    enrollTime: datetime = field(default_factory=lambda: datetime.now())

    def db_insert(self, db: Database) -> InsertOneResult:
        c = db.get_collection(DB_USER_COLLECTION_NAME)
        return c.insert_one(asdict(self))

