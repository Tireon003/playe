import base64

from pydantic import BaseModel, field_validator

from .genre_schema import GenreFromDB


class VideoFromDB(BaseModel):
    id: int
    title: str
    description: str
    duration: int
    file_name: str
    genre_id: int
    preview_img: str

    @field_validator("preview_img", mode="plain")
    @classmethod
    def convert_from_bytes_to_base64string(cls, value: bytes | str) -> str:
        if isinstance(value, bytes):
            return base64.b64encode(value).decode("utf-8")
        elif isinstance(value, str):
            return value
        else:
            raise ValueError(
                "preview_img value must be bytes to convert to base64string"
            )

    class Config:
        from_attributes = True


class VideoFromDBRelGenre(VideoFromDB):
    genre: GenreFromDB
