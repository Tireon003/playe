from pydantic import BaseModel, Field
from typing_extensions import TYPE_CHECKING

if TYPE_CHECKING:
    from .video_schema import VideoFromDB


class BaseGenre(BaseModel):
    genre_name: str = Field(min_length=1, max_length=50)


class GenreFromClient(BaseGenre):
    pass


class GenreFromDB(BaseGenre):
    id: int

    class Config:
        from_attributes = True


class GenreFromDBRelVideos(GenreFromDB):
    videos: list["VideoFromDB"]
