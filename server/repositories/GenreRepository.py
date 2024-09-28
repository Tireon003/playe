from sqlalchemy import select

from models import Genre


class GenreRepository:

    def __init__(self, session) -> None:
        self.session = session

    async def select_genres(self) -> list[Genre] | None:
        stmt = (
            select(Genre)
        )
        result = await self.session.scalars(stmt)
        genres = [genre for genre in result.all()]
        return genres

