import os
import secrets

from dotenv import load_dotenv, set_key

from sandglass_api.models.project import Project
from sandglass_api.models.user import User

# This list records all documents,for the sake of local tests
# (the collections listed will be dropped when starting a test)
ALL_DOCUMENTED_TYPE = [User, Project]

ENV_FILE = '.env'


def generate_secret_key():
    """
    Generate a random secret key and save it to the .env file if it doesn't exist.
    """
    secret_key = os.getenv("SG_SECRET_KEY")

    if not secret_key:
        secret_key = secrets.token_urlsafe(32)
        os.environ["SG_SECRET_KEY"] = secret_key

        set_key(ENV_FILE, "SG_SECRET_KEY", secret_key)
        print("⚠️ 生成并保存了新的 SECRET_KEY")
    else:
        print("✅ 已存在 SECRET_KEY")


class Config(object):
    load_dotenv(override=False)
    generate_secret_key()

    DEBUG = False
    SECRET_KEY = os.getenv("SG_SECRET_KEY")

    # DO NOT PUT DATABASE NAME IN URI
    DB_URI = os.getenv("SG_DB_URI")
    DB_DATABASE_NAME = "sandglass"

    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_EXPIRE_TIME = 3600  # unit:second
    JWT_INVALIDATE_FRESHNESS_FACTOR = 0.2  # If a token is still valid for LESS than 80%(1-20%) of its lifetime, it will be set as not fresh
    JWT_REFRESH_FACTOR = 0.8  # If a token is still valid for LESS than 20% of its lifetime, it will be refreshed

    OSS_ENDPOINT = os.getenv("SG_OSS_ENDPOINT")
    OSS_REGION = os.getenv("SG_OSS_REGION")
    OSS_BUCKET_NAME = 'sandglass-attachment'
    OSS_ACCESS_KEY_ID = os.getenv("SG_OSS_ACCESS_KEY_ID")
    OSS_ACCESS_KEY_SECRET = os.getenv("SG_OSS_ACCESS_KEY_SECRET")
    OSS_SIGNATURE_EXPIRE_TIME = 5 * 60  # unit:second
