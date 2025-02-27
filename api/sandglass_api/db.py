from mongoengine import connect
from .env import DB_URI, DB_DATABASE_NAME

def initialize():
    connect(DB_DATABASE_NAME,host=DB_URI)

