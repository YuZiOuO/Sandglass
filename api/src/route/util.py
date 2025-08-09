from pydantic import BaseModel


class ServiceError(BaseModel):
    msg: str


AuthError = {
    "model":       ServiceError,
    "description": "Unauthenticated"
}
