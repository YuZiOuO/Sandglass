from dotenv import load_dotenv
load_dotenv()

from route import user_routes, auth_routes, node_routes, project_routes

import uvicorn
from fastapi import FastAPI
from starlette.responses import PlainTextResponse

from db import db_lifespan

# TODO：migrate to SQLModel

app = FastAPI(lifespan=db_lifespan, debug=True, swagger_ui_parameters={"withCredentials": True})
app.include_router(user_routes.router, tags=["user"])
app.include_router(auth_routes.router)
app.include_router(project_routes.router, tags=["project"])
app.include_router(node_routes.router, tags=["node"])

@app.get('/health')
def health_check():
    return PlainTextResponse(content="OK")

if __name__ == '__main__':
    uvicorn.run(app,host='0.0.0.0',port=8000)





