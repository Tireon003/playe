from fastapi import (
    APIRouter,
    status,
    Query,
    Depends,
    HTTPException,
    File,
    UploadFile,
)
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Annotated, AsyncGenerator, Optional
import aiofiles
from pathlib import Path

from schemas import VideoFromDBRelGenre, TokenPayload, VideoFromDB
from depends import get_video_repo, get_admin_data
from core import db
from repositories import VideoRepository


router = APIRouter(
    prefix="/api/videos",
    tags=["videos"],
)


@router.get(
    path="/",
    response_model=list[VideoFromDBRelGenre],
    status_code=status.HTTP_200_OK,
)
async def get_videos_of_genre(
    genre_id: Annotated[int, Query()],
    video_repo: VideoRepository = Depends(get_video_repo(db.get_session)),
) -> list[VideoFromDBRelGenre]:
    videos_of_genre = await video_repo.select_videos_by_genre(
        genre_id=genre_id
    )
    videos_dto = [
        VideoFromDBRelGenre.model_validate(video) for video in videos_of_genre
    ]
    return videos_dto


@router.get(
    path="/all",
    response_model=list[VideoFromDBRelGenre],
    status_code=status.HTTP_200_OK,
)
async def get_all_videos(
    video_repo: VideoRepository = Depends(get_video_repo(db.get_session)),
) -> list[VideoFromDBRelGenre]:
    videos_from_db = await video_repo.select_videos_all()
    videos_dto = [
        VideoFromDBRelGenre.model_validate(video) for video in videos_from_db
    ]
    return videos_dto


@router.get(path="/watch", status_code=status.HTTP_200_OK)
async def stream_video(
    video_filename: Annotated[str, Query()],
    genre_id: Annotated[int, Query()],
) -> StreamingResponse:
    async def iterate_video(source: str) -> AsyncGenerator[bytes, None]:
        chunk_size = 2 * 1024 * 1024  # 2 MB
        async with aiofiles.open(source, mode="rb") as file:
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                yield chunk

    video_source = f"{Path(__file__).parent.parent.parent}/content/{genre_id}/{video_filename}"

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


@router.post(
    path="/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=VideoFromDB,
)
async def upload_video(
    video_repo: Annotated[
        VideoRepository,
        Depends(get_video_repo(db.get_session)),
    ],
    admin_data: Annotated[
        TokenPayload,
        Depends(get_admin_data),
    ],  # auth
    title: str = Query(min_length=5, max_length=50),
    description: str = Query(
        default="",
        min_length=5,
        max_length=200,
    ),
    genre_id: int = Query(gt=0),
    video: UploadFile = File(...),
    preview_image: Optional[UploadFile] = File(None),
) -> VideoFromDB:
    if not video.filename.endswith(".mp4"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be in MP4 format.",
        )

    if video.size > 100 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be less than 100 MB.",
        )

    # Проверка для превью-изображения (если оно было загружено)
    if preview_image:
        if not preview_image.filename.endswith((".jpg", ".jpeg", ".png")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Preview image must be in JPG, JPEG, or PNG format.",
            )

        if (
            preview_image.size > 5 * 1024 * 1024
        ):  # Ограничение на размер превью
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Preview image size must be less than 5 MB.",
            )

    new_video_data_model = await video_repo.create_video(
        video_file=video,
        title=title,
        description=description,
        genre_id=genre_id,
        preview_image=preview_image,  # Передаем превью в репозиторий, если нужно
    )

    video_dto = VideoFromDB.model_validate(new_video_data_model)
    return video_dto


@router.delete(
    path="/delete",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_video(
    admin_data: Annotated[TokenPayload, Depends(get_admin_data)],  # auth
    video_repo: Annotated[
        VideoRepository,
        Depends(get_video_repo(db.get_session)),
    ],
    video_id: Annotated[int, Query(gt=0)],
) -> JSONResponse:
    await video_repo.delete_video(video_id=video_id)
    return JSONResponse(
        status_code=status.HTTP_204_NO_CONTENT,
        content="Video deleted successfully",
    )


@router.get(
    path="/search",
    status_code=status.HTTP_200_OK,
    response_model=list[VideoFromDB],
    description="Search for videos by matches in title",
)
async def get_videos_by_keywords(
    text: Annotated[str, Query(min_length=1, max_length=100)],
    video_repo: Annotated[
        VideoRepository,
        Depends(get_video_repo(db.get_session)),
    ],
) -> list[VideoFromDB]:
    videos = await video_repo.select_videos_by_keywords(text=text)
    videos_dto = [VideoFromDB.model_validate(video) for video in videos]
    return videos_dto
