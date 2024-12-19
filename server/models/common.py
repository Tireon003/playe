from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, LargeBinary


class Base(DeclarativeBase): ...


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=True)
    genre_id: Mapped[int] = mapped_column(
        ForeignKey("genres.id"),
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
    )
    duration: Mapped[int] = mapped_column(nullable=False)
    preview_img: Mapped[bytes | None] = mapped_column(
        LargeBinary, nullable=True
    )

    genre: Mapped["Genre"] = relationship(
        back_populates="videos",
    )


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    genre_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
    )

    videos: Mapped[list["Video"]] = relationship(
        back_populates="genre",
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        unique=True,
    )
    hashed_password: Mapped[str]
