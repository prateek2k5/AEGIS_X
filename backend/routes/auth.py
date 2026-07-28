from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.auth import create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


# Temporary credentials
USERNAME = "admin"
PASSWORD = "admin123"


@router.post("/login")
def login(data: LoginRequest):

    if data.username != USERNAME or data.password != PASSWORD:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {"sub": data.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": data.username
    }