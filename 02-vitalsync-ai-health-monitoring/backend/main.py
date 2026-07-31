from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.config import settings
from app.database import connect_db, close_db
from app.routers import auth, health_data, predictions, alerts, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title="VitalSync API", description="AI-powered health risk prediction", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(health_data.router, prefix="/api/health-data", tags=["Health Data"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["AI Predictions"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
