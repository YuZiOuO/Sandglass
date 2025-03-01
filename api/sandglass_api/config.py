# DO NOT PUT DATABASE NAME IN URI

from sandglass_api.models.access_control import AccessControlList
from sandglass_api.models.resource import Resource
from sandglass_api.models.user import Session, User

DB_URI = "mongodb+srv://pyuser:rT9yvudfGwdF22h6@cluster0.bcpu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_DATABASE_NAME = "sandglass"

# This list records all documents,for the sake of tests
# (the collections listed will be dropped when starting a test)
ALL_DOCUMENTED_TYPE = [User, Session, Resource, AccessControlList]


class FlaskConfig:
    SECRET_KEY = b'_5#y2L"F4Q8z\n\xec]/',
    DEBUG = True
