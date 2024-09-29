import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import (
    FastAPI,
)

from routes import (
    genre_router,
    video_router,
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.0:5173",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.include_router(genre_router)
app.include_router(video_router)


if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )