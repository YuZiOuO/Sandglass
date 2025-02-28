from datetime import datetime
from enum import Enum

import mongoengine as me

class SessionStatus(str,Enum):
    VALID = 'VALID'
    INVALID = 'INVALID'
    EXPIRED = 'EXPIRED'

class Session(me.Document):
    issuance_time = me.DateTimeField(default=datetime.now())
    expire_in = me.IntField(default=3600)
    status = me.EnumField(SessionStatus)

class User(me.Document):
    nickname = me.StringField()
    email = me.EmailField(required=True,unique=True)
    pwd = me.StringField(required=True)
    avatarUrl = me.URLField()
    pwd_salt = me.UUIDField(required=True)
    signup_timestamp = me.DateTimeField(default=datetime.now())
    sessions = me.ListField(me.ReferenceField(Session))



