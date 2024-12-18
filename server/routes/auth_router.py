from typing import Annotated

from fastapi import APIRouter, Body, Depends
from starlette import status
from starlette.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from core import db
from depends import get_admin_repo
from repositories import AdminRepository
from schemas import UserCreate

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


@router.post(
    path="/signup",
    status_code=status.HTTP_201_CREATED,
)
async def create_user_account(
    user_data: Annotated[UserCreate, Depends(OAuth2PasswordRequestForm)],
    admin_repo: Annotated[
        AdminRepository,
        Depends(get_admin_repo(db.get_session)),
    ],
) -> JSONResponse:
    await admin_repo.create_user(user_data)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"msg": "Successful!"},
    )


@router.post(
    path="/login",
    status_code=status.HTTP_200_OK,
)
async def login_user(
    user_data: Annotated[UserCreate, Depends(OAuth2PasswordRequestForm)],
    admin_repo: Annotated[
        AdminRepository,
        Depends(get_admin_repo(db.get_session)),
    ],
) -> JSONResponse:
    token = await admin_repo.login_user(user_data)
    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "token_type": "Bearer",
            "access_token": token,
        },
    )
    response.set_cookie(
        key="access_token",
        value=token,
        max_age=2592000,
        secure=True,
    )
    return response
