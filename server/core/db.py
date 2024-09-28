from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from config import settings
from contextlib import asynccontextmanager
from typing import AsyncGenerator


class Database:

    def __init__(self) -> None:
        self.aengine = create_async_engine(
            url=settings.db_url,
        )
        self.asession = async_sessionmaker(
            self.aengine,
            expire_on_commit=False
        )

    @asynccontextmanager
    async def create_session(self) -> AsyncGenerator[AsyncSession, None]:
        try:
            async with self.asession() as session:
                yield session
        except Exception as e:
            await session.rollback()
            raise e

    async def get_session(self) -> AsyncSession:
        async with self.create_session() as session:
            yield session


db = Database()

