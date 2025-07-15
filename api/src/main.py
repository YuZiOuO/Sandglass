from fastapi import FastAPI

from module import auth
from route import user, project, node

app = FastAPI()

app.include_router(user.router, tags=["user"])
app.include_router(auth.router)
app.include_router(project.router,tags=["project"])
app.include_router(node.router,tags=["node"])