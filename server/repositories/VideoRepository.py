import os
import uuid

from fastapi import UploadFile, HTTPException
from moviepy import VideoFileClip
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from models import Video, Genre


class VideoRepository:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def select_videos_by_genre(self, genre_id: int) -> list[Video]:
        stmt = (
            select(Video)
            .options(joinedload(Video.genre))
            .filter_by(genre_id=genre_id)
        )
        result = await self.session.scalars(stmt)
        videos = [video for video in result.all()]
        return videos

    async def select_videos_all(self) -> list[Video]:
        stmt = select(Video).options(joinedload(Video.genre))
        result = await self.session.scalars(stmt)
        return [video for video in result.all()]

    async def create_video(
        self,
        video_file: UploadFile,
        preview_image: UploadFile | None,
        title: str,
        description: str,
        genre_id: int,
    ) -> Video:

        genre = await self.session.get(Genre, genre_id)
        if not genre:
            raise HTTPException(
                status_code=404,
                detail="Genre does not exist.",
            )

        file_name = f"{uuid.uuid4()}.mp4"
        genre_path = f"/app/content/{genre_id}"

        # os.makedirs(genre_path, exist_ok=True)

        new_file_path = f"{genre_path}/{file_name}"
        with open(new_file_path, "wb") as buffer:
            content = await video_file.read()
            buffer.write(content)

        video_clip = VideoFileClip(new_file_path)
        duration_minutes = round(video_clip.duration / 60)

        new_video = Video(
            title=title,
            description=description,
            genre_id=genre_id,
            file_name=file_name.rstrip(".mp4"),
            duration=duration_minutes,
        )

        if preview_image:
            new_video.preview_img = await preview_image.read()

        self.session.add(new_video)
        await self.session.flush()
        await self.session.refresh(new_video)
        await self.session.commit()

        return new_video

    async def delete_video(self, video_id: int) -> None:
        video = await self.session.get(Video, video_id)
        if not video:
            raise HTTPException(
                status_code=404,
                detail="Video does not exist.",
            )
        await self.session.delete(video)
        return None

    async def select_videos_by_keywords(self, text: str) -> list[Video]:
        stmt = select(Video).where(Video.title.ilike(f"%{text.strip()}%"))
        result = await self.session.scalars(stmt)
        return [video for video in result.all()]
