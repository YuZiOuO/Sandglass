from datetime import datetime
from ipaddress import IPv4Address, IPv6Address
from typing import Annotated, Optional

from beanie import Document, Link, Indexed
from pydantic import Field, BaseModel

from model.user_model import User


class RefreshToken(Document):
    user: Link[User]
    expire_at: datetime
    hashed_token: Annotated[str, Indexed()]
    revoked: bool = False

    # Debug Info
    issued_at: Annotated[datetime, Field(default_factory=datetime.now)]
    ip_addr: Optional[IPv4Address | IPv6Address | str] = None
    user_agent: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
