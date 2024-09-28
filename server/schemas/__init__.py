from .genre_schema import GenreFromDB, GenreFromDBRelVideos
from .video_schema import VideoFromDB, VideoFromDBRelGenre

__all__ = (
    'GenreFromDB',
    'VideoFromDB',
    'GenreFromDBRelVideos',
    'VideoFromDBRelGenre',
)
