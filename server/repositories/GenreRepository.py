import os

from sqlalchemy import select, delete

from models import Genre


class GenreRepository:

    def __init__(self, session) -> None:
        self.session = session

    async def select_genres(self) -> list[Genre]:
        stmt = select(Genre)
        result = await self.session.scalars(stmt)
        genres = [genre for genre in result.all()]
        return genres

    async def select_genre(self, genre_id: int) -> Genre:
        genre = await self.session.get(Genre, genre_id)
        return genre

    async def update_genre(self, genre_id: int, genre_name: str) -> Genre:
        genre = await self.session.get(Genre, genre_id)
        genre.genre_name = genre_name
        await self.session.commit()
        await self.session.refresh(genre)
        return genre

    async def delete_genre(self, genre_id: int) -> None:
        stmt = delete(Genre).filter_by(id=genre_id)
        await self.session.execute(stmt)
        await self.session.commit()
        return None

    async def create_genre(self, name: str) -> Genre:
        genre = Genre(genre_name=name)
        self.session.add(genre)
        await self.session.commit()
        await self.session.refresh(genre)
        # root_dir = os.path.dirname(os.path.abspath(__file__))
        # genre_dir = os.path.join("/", "app", "content", f"{genre.id}")
        os.makedirs(f"/app/content/{genre.id}", exist_ok=True)
        return genre
