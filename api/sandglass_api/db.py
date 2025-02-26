from pymongo import MongoClient

from env import DB_DATABASE_NAME, DB_URI, DB_PROJECT_COLLECTION_NAME

def initialize() -> MongoClient | None:
    try:
        cli = MongoClient(DB_URI)
        database = cli.get_database(DB_DATABASE_NAME)
        proj_collection = database.get_collection(DB_PROJECT_COLLECTION_NAME)
        return cli
    except Exception as e:
        print("Error Initializing Database: ",e)
    return None

