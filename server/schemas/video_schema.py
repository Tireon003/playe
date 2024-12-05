from pydantic import BaseModel

from .genre_schema import GenreFromDB


class VideoFromDB(BaseModel):
    id: int
    title: str
    description: str
    duration: int
    file_name: str
    genre_id: int

    class Config:
        from_attributes = True


class VideoFromDBRelGenre(VideoFromDB):
    genre: GenreFromDB
