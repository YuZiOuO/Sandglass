import mongoengine as me
from flask import Flask

from sandglass_api.config import ALL_DOCUMENTED_TYPE


def initialize_db(app: Flask):
    me.connect(app.config["DB_DATABASE_NAME"], host=app.config["DB_URI"])

# WARNING:THIS WILL DROP **ALL** COLLECTIONS
# DO NOT USE IN PRODUCTION ENV
def RESET_DATABASE(config):
    if not config.get("TESTING"):
        raise Exception("RESET_DATABASE should only be used in testing environment")
    for t in ALL_DOCUMENTED_TYPE:
        t.drop_collection()
