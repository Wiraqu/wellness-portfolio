from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client: AsyncIOMotorClient = None

async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB")

async def close_db():
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_db():
    return client[settings.DATABASE_NAME]
