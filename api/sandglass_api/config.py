from sandglass_api.models.access_control import AccessControlList
from sandglass_api.models.resource import Resource
from sandglass_api.models.user import User

# DO NOT PUT DATABASE NAME IN URI
DB_URI = "mongodb+srv://pyuser:rT9yvudfGwdF22h6@cluster0.bcpu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_DATABASE_NAME = "sandglass"

# This list records all documents,for the sake of tests
# (the collections listed will be dropped when starting a test)
ALL_DOCUMENTED_TYPE = [User, Resource, AccessControlList]

JWT_EXPIRE_TIME = 3600  # unit:second
JWT_INVALIDATE_FRESHNESS_FACTOR = 0.2  # If a token is still valid for LESS than 80%(1-20%) of its lifetime, it will be set as not fresh
JWT_REFRESH_FACTOR = 0.8  # If a token is still valid for LESS than 20% of its lifetime, it will be refreshed

class FlaskConfig:
    DEBUG = True
    SECRET_KEY = b'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
