from fastapi import (
    APIRouter,
    status,
    Depends,
    Path,
    Query,
)
from fastapi.responses import JSONResponse
from typing import Annotated

from depends import get_genre_repo, get_admin_data
from core import db
from repositories import GenreRepository
from schemas import GenreFromDB, TokenPayload
from schemas.genre_schema import GenreFromClient

router = APIRouter(
    prefix="/api/genres",
    tags=["genres"],
)


@router.get(
    path="/",
    response_model=list[GenreFromDB],
    status_code=status.HTTP_200_OK,
)
async def get_genres(
    genre_repo: Annotated[
        GenreRepository,
        Depends(get_genre_repo(db.get_session)),
    ]
) -> list[GenreFromDB]:
    genres = await genre_repo.select_genres()
    genres_dto = [GenreFromDB.model_validate(genre) for genre in genres]
    return genres_dto


@router.get(
    path="/{id}",
    response_model=GenreFromDB,
    status_code=status.HTTP_200_OK,
)
async def get_genre(
    id: Annotated[int, Path()],
    genre_repo: Annotated[
        GenreRepository,
        Depends(get_genre_repo(db.get_session)),
    ],
) -> GenreFromDB:
    genre = await genre_repo.select_genre(id)
    genre_dto = GenreFromDB.model_validate(genre)
    return genre_dto


@router.patch(
    path="/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def update_genre(
    id: Annotated[int, Path()],
    name: Annotated[str, Query()],
    genre_repo: Annotated[
        GenreRepository,
        Depends(get_genre_repo(db.get_session)),
    ],
    admin_data: Annotated[TokenPayload, Depends(get_admin_data)],  # auth
) -> JSONResponse:
    await genre_repo.update_genre(id, name)


@router.delete(
    path="/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_genre(
    id: Annotated[int, Path()],
    genre_repo: Annotated[
        GenreRepository,
        Depends(get_genre_repo(db.get_session)),
    ],
    admin_data: Annotated[TokenPayload, Depends(get_admin_data)],  # auth
) -> JSONResponse:
    await genre_repo.delete_genre(id)


@router.post(
    path="/",
    status_code=status.HTTP_201_CREATED,
)
async def create_new_genre(
    name: Annotated[str, Query(min_length=3, max_length=50)],
    genre_repo: Annotated[
        GenreRepository,
        Depends(get_genre_repo(db.get_session)),
    ],
    admin_data: Annotated[TokenPayload, Depends(get_admin_data)],  # auth
) -> JSONResponse:
    await genre_repo.create_genre(name)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=dict(msg="Genre successfully created!"),
    )
