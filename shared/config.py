import os


class Settings:
    """
    One configuration source for local development and AWS deployment.

    Local:
        DATABASE_URL=sqlite:///./gamification.db
        or MySQL via docker-compose.

    AWS:
        DATABASE_URL points to RDS MySQL.
        Service URLs point to the deployed internal endpoints.
    """

    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gamification.db")

    CREATION_SERVICE_URL = os.getenv("CREATION_SERVICE_URL", "http://localhost:8001")

    XP_SERVICE_URL = os.getenv("XP_SERVICE_URL", "http://localhost:8002")

    AVATAR_SERVICE_URL = os.getenv("AVATAR_SERVICE_URL", "http://localhost:8003")

    SOURCE_SYSTEM = os.getenv("SOURCE_SYSTEM", "ALUMABLE")


settings = Settings()
