from pydantic import BaseModel, Field


class BaseUser(BaseModel):
    username: str = Field(min_length=3, max_length=20)


class UserCreate(BaseUser):
    password: str = Field(min_length=8, max_length=20)


class UserFromDB(BaseUser):
    id: int
    hashed_password: str

    class Config:
        from_attributes = True
