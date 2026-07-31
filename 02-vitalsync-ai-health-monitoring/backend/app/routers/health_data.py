from fastapi import APIRouter, Depends
from typing import List
from app.models import HealthDataPoint
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

@router.post("/")
async def create_health_data(data: HealthDataPoint, user_id: str = Depends(get_current_user)):
    db = get_db()
    result = await db.health_data.insert_one(data.dict())
    return {"id": str(result.inserted_id), **data.dict()}

@router.get("/employee/{employee_id}")
async def get_employee_data(employee_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    data = await db.health_data.find({"employee_id": employee_id}).sort("recorded_at", -1).to_list(100)
    return [{"id": str(d["_id"]), **{k: v for k, v in d.items() if k != "_id"}} for d in data]

@router.get("/workforce/summary")
async def get_workforce_summary(user_id: str = Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$metric_type", "avg_value": {"$avg": "$value"}, "count": {"$sum": 1}}}
    ]
    results = await db.health_data.aggregate(pipeline).to_list(10)
    return {r["_id"]: {"avg": round(r["avg_value"], 2), "count": r["count"]} for r in results}
