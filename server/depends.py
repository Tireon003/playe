from datetime import datetime as dt, timezone as tz

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Callable, Annotated


from config import settings
from repositories import GenreRepository, VideoRepository, AdminRepository
from schemas import TokenPayload
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_genre_repo(get_async_session) -> Callable:
    def _get_genre_repo(
        session: AsyncSession = Depends(get_async_session),
    ) -> GenreRepository:
        return GenreRepository(session)

    return _get_genre_repo


def get_video_repo(get_async_session) -> Callable:
    def _get_video_repo(
        session: AsyncSession = Depends(get_async_session),
    ) -> VideoRepository:
        return VideoRepository(session)

    return _get_video_repo


def get_admin_repo(get_async_session) -> Callable:
    def _get_admin_repo(
        session: AsyncSession = Depends(get_async_session),
    ) -> AdminRepository:
        return AdminRepository(session)

    return _get_admin_repo


def get_admin_data(
    access_token: Annotated[
        str,
        Depends(oauth2_scheme),
    ]
) -> TokenPayload:
    try:
        payload = jwt.decode(
            jwt=access_token,
            key=settings.TOKEN_SECRET,
            algorithms=["HS256"],
        )
        if payload["exp"] < int(dt.now(tz=tz.utc).timestamp()):
            raise ValueError("Token expired")
        return TokenPayload.model_validate(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
