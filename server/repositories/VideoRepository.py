from sqlalchemy import select
from sqlalchemy.orm import joinedload

from models import Video


class VideoRepository:

    def __init__(self, session) -> None:
        self.session = session

    async def select_videos_by_genre(self, genre_id: int) -> list[Video] | None:
        stmt = (
            select(Video)
            .options(joinedload(Video.genre))
            .filter_by(genre_id=genre_id)
        )
        result = await self.session.scalars(stmt)
        videos = [video for video in result.all()]
        return videos
