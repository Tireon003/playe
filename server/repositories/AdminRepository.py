from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import bcrypt
import jwt
from datetime import datetime as dt, timezone

from config import settings
from models import User
from schemas import UserCreate, TokenPayload


class AdminRepository:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_user(self, user: UserCreate) -> None:
        hashed_password = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt(),
        )
        new_user = User(
            username=user.username,
            hashed_password=hashed_password.decode("ascii"),
        )
        self.session.add(new_user)
        await self.session.commit()
        await self.session.refresh(new_user)
        return None

    async def login_user(self, user: UserCreate) -> str:
        stmt = select(User).filter_by(username=user.username)
        result = await self.session.scalars(stmt)
        user_in_db = result.one_or_none()
        if user_in_db is not None:
            if bcrypt.checkpw(
                user.password.encode("utf-8"),
                user_in_db.hashed_password.encode("ascii"),
            ):
                token_payload = TokenPayload(
                    sub=user_in_db.id,
                    exp=int(dt.now(tz=timezone.utc).timestamp()) + 2592000,
                )
                token = jwt.encode(
                    payload=token_payload.model_dump(),
                    key=settings.TOKEN_SECRET,
                    algorithm="HS256",
                )
                return token
        else:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )
