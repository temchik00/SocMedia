from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret: str
    development_mode: bool = True
    server_port: int = 8005
    jwt_algorithm: str = 'HS256'
    jwt_lifetime: int = 3600
    user_count_in_responce: int = 42


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
