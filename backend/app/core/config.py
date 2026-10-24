"""
Application settings loaded from .env via pydantic-settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Google AI / Gemma
    google_api_key: str = ""

    # Bhashini
    bhashini_user_id: str = ""
    bhashini_api_key: str = ""
    bhashini_pipeline_id: str = ""

    # App
    app_env: str = "development"
    data_dir: str = "./data"
    schemes_file: str = "./data/schemes.json"
    chroma_db_dir: str = "./data/chroma_db"

    # Gemma model name (can override to local model path)
    gemma_model: str = "gemini-3.5-flash"  # or "gemini-3.8-flash" / "models/gemma-4-31b-it"


settings = Settings()
