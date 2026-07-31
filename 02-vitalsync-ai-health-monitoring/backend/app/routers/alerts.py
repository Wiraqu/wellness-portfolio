from fastapi import APIRouter, Depends
from typing import List, Optional
from datetime import datetime
from app.models import Alert, RiskLevel
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_alerts(severity: Optional[RiskLevel] = None, user_id: str = Depends(get_current_user)):
    db = get_db()
    query = {"resolved": False}
    if severity: query["severity"] = severity
    alerts = await db.alerts.find(query).sort("created_at", -1).to_list(50)
    return [{"id": str(a["_id"]), **{k: v for k, v in a.items() if k != "_id"}} for a in alerts]

@router.post("/")
async def create_alert(alert: Alert, user_id: str = Depends(get_current_user)):
    db = get_db()
    result = await db.alerts.insert_one(alert.dict())
    return {"id": str(result.inserted_id), **alert.dict()}

@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    from bson import ObjectId
    await db.alerts.update_one({"_id": ObjectId(alert_id)}, {"$set": {"resolved": True, "resolved_at": datetime.utcnow()}})
    return {"message": "Alert resolved"}
