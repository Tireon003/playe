from fastapi import APIRouter, status, Depends
from typing import Annotated

from depends import get_genre_repo
from core import db
from repositories import GenreRepository
from schemas import GenreFromDB

router = APIRouter(
    prefix="/api/genres",
    tags=["genres"],
)


@router.get("/", response_model=list[GenreFromDB], status_code=status.HTTP_200_OK)
async def get_genres(
        genre_repo: Annotated[GenreRepository, Depends(get_genre_repo(db.get_session))]
) -> list[GenreFromDB]:
    genres = await genre_repo.select_genres()
    genres_dto = [GenreFromDB.model_validate(genre) for genre in genres]
    return genres_dto
