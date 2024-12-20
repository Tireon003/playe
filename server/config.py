from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_NAME: str
    DB_USER: str
    DB_PASS: str
    DB_HOST: str
    DB_PORT: int

    TOKEN_SECRET: str

    @property
    def db_url(self):
        return (f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}"
                f":{self.DB_PORT}/{self.DB_NAME}")

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
