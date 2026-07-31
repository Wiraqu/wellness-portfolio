from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "VitalSync"
    DEBUG: bool = True
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "vitalsync"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    FIREBASE_PROJECT_ID: str = ""
    class Config:
        env_file = ".env"

settings = Settings()
