from .genre_router import router as genre_router
from .video_router import router as video_router
from .auth_router import router as auth_router

__all__ = (
    "genre_router",
    "video_router",
    "auth_router",
)