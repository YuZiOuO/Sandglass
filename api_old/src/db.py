import logging
import os
from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from model.attachments_model import Attachment
from model.auth_model import RefreshToken
from model.node_model import Node
from model.project_model import Project
from model.user_model import User

document_types = [Attachment, Node, Project, User, RefreshToken]

async def init_db():
    client = AsyncIOMotorClient(os.getenv("DB_URI"))
    await init_beanie(database=client.get_default_database(), document_models=document_types)
    logging.info("Database initialized.")

@asynccontextmanager
async def db_lifespan(app:FastAPI):
    await init_db()
    yield
