import logging
import os
from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

import module


async def init_db():
    client = AsyncIOMotorClient(os.getenv("DB_URI"))
    await init_beanie(database=client.get_default_database(), document_models=module.document_types)
    logging.info("Database initialized.")

@asynccontextmanager
async def db_lifespan(app:FastAPI):
    await init_db()
    yield
