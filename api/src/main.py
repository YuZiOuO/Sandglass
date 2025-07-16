import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI

from db import db_lifespan
from module import auth
from route import user, project, node

# TODO：migrate to SQLModel

load_dotenv()

app = FastAPI(lifespan=db_lifespan,debug=True)
app.include_router(user.router, tags=["user"])
app.include_router(auth.router)
app.include_router(project.router, tags=["project"])
app.include_router(node.router, tags=["node"])

if __name__ == '__main__':
    uvicorn.run(app,host='0.0.0.0',port=8000)





