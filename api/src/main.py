from dotenv import load_dotenv

load_dotenv()

import uvicorn
from fastapi import FastAPI
from starlette.responses import PlainTextResponse

from db import db_lifespan
from module import auth
from route import user, project, node

# TODO：migrate to SQLModel

app = FastAPI(lifespan=db_lifespan, debug=True, swagger_ui_parameters={"withCredentials": True})
app.include_router(user.router, tags=["user"])
app.include_router(auth.router)
app.include_router(project.router, tags=["project"])
app.include_router(node.router, tags=["node"])


@app.get('/health')
def health_check():
    return PlainTextResponse(content="OK")

if __name__ == '__main__':
    uvicorn.run(app,host='0.0.0.0',port=8000)





