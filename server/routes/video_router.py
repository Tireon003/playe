from fastapi import (
    APIRouter,
    status,
    Query,
    Depends,
    HTTPException,
)
from fastapi.responses import StreamingResponse
from typing import Annotated, AsyncGenerator
import aiofiles
from pathlib import Path

from schemas import VideoFromDBRelGenre
from depends import get_video_repo
from core import db
from repositories import VideoRepository


router = APIRouter(
    prefix="/api/videos",
    tags=["videos"],
)


@router.get("/", response_model=list[VideoFromDBRelGenre] | None, status_code=status.HTTP_200_OK)
async def get_videos_of_genre(
        genre_id: Annotated[int, Query()],
        video_repo: VideoRepository = Depends(get_video_repo(db.get_session))
) -> list[VideoFromDBRelGenre] | None:
    videos_of_genre = await video_repo.select_videos_by_genre(genre_id=genre_id)
    videos_dto = [VideoFromDBRelGenre.model_validate(video) for video in videos_of_genre]
    return videos_dto


@router.get("/watch", status_code=status.HTTP_200_OK)
async def stream_video(video_filename: Annotated[str, Query()],
                       genre_id: Annotated[int, Query()]
                       ) -> StreamingResponse:
    async def iterate_video(source: str) -> AsyncGenerator[bytes, None]:
        chunk_size = 2 * 1024 * 1024  # 2 MB
        async with aiofiles.open(source, mode='rb') as file:
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                yield chunk

    video_source = f'{Path(__file__).parent.parent.parent}/content/{genre_id}/{video_filename}'

    try:
        return StreamingResponse(
            content=iterate_video(source=video_source),
            media_type="video/mp4",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video doesn't exist",
        )
