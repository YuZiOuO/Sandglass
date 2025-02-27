from datetime import datetime
from enum import Enum

import mongoengine as me
from mongoengine import ReferenceField, IntField, EnumField, ListField, DateTimeField


class SessionStatus(str,Enum):
    VALID = 'VALID'
    INVALID = 'INVALID'
    EXPIRED = 'EXPIRED'

class Session(me.Document):
    issuance_time = DateTimeField(default=datetime.now())
    expire_in = IntField(default=3600)
    status = EnumField(SessionStatus)

class User(me.Document):
    nickname = me.StringField()
    email = me.EmailField()
    pwd = me.StringField()
    avatarUrl = me.URLField()
    pwd_salt = me.UUIDField()
    signup_timestamp = me.DateTimeField(default=datetime.now())
    sessions = ListField(ReferenceField(Session))



