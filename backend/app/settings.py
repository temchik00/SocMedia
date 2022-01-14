from pydantic import BaseSettings

class Settings(BaseSettings):
    server_port: int = 8005
    database_url: str = 'postgresql://postgres:password@localhost:5432/socmedia'

settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)