from database.connection import engine
from database.models import Base


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
