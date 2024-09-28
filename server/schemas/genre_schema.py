from pydantic import BaseModel
from typing_extensions import TYPE_CHECKING

if TYPE_CHECKING:
    from .video_schema import VideoFromDB


class GenreFromDB(BaseModel):
    id: int
    genre_name: str

    class Config:
        from_attributes = True


class GenreFromDBRelVideos(GenreFromDB):
    videos: list["VideoFromDB"]
