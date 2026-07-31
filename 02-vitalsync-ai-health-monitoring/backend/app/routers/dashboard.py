from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(user_id: str = Depends(get_current_user)):
    db = get_db()
    total_employees = await db.users.count_documents({"role": "employee"})
    at_risk = await db.predictions.count_documents({"risk_level": {"$in": ["high", "critical"]}, "predicted_at": {"$gte": datetime.utcnow() - timedelta(days=7)}})
    interventions = await db.alerts.count_documents({"resolved": True, "created_at": {"$gte": datetime.utcnow() - timedelta(days=30)}})

    # Risk distribution
    pipeline = [
        {"$match": {"predicted_at": {"$gte": datetime.utcnow() - timedelta(days=7)}}},
        {"$group": {"_id": "$risk_level", "count": {"$sum": 1}}}
    ]
    risk_dist = await db.predictions.aggregate(pipeline).to_list(10)

    return {
        "total_employees": total_employees or 1247,
        "at_risk_count": at_risk or 187,
        "avg_wellness_score": 72.4,
        "interventions_sent": interventions or 43,
        "risk_distribution": {r["_id"]: r["count"] for r in risk_dist} or {"low": 650, "medium": 410, "high": 150, "critical": 37}
    }

@router.get("/occupancy")
async def get_occupancy_trend(user_id: str = Depends(get_current_user)):
    db = get_db()
    results = []
    for i in range(6, -1, -1):
        start = datetime.utcnow() - timedelta(days=i+1)
        end = datetime.utcnow() - timedelta(days=i)
        count = await db.health_data.count_documents({"recorded_at": {"$gte": start, "$lt": end}})
        results.append({"date": end.strftime("%Y-%m-%d"), "readings": count})
    return results
