from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Callable

from repositories import GenreRepository, VideoRepository


def get_genre_repo(get_async_session) -> Callable:
    def _get_genre_repo(session: AsyncSession = Depends(get_async_session)) -> GenreRepository:
        return GenreRepository(session)

    return _get_genre_repo


def get_video_repo(get_async_session) -> Callable:
    def _get_video_repo(session: AsyncSession = Depends(get_async_session)) -> VideoRepository:
        return VideoRepository(session)

    return _get_video_repo
