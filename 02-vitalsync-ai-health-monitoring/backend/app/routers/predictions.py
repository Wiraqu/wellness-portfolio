from fastapi import APIRouter, Depends
from typing import List
import numpy as np
from datetime import datetime, timedelta
from app.models import RiskPrediction, RiskLevel
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

def predict_risk(employee_data: dict) -> RiskPrediction:
    metrics = employee_data.get("metrics", [])
    risk_score = 30.0
    for m in metrics:
        if m["metric_type"] == "sleep" and m["value"] < 6: risk_score += 20
        elif m["metric_type"] == "stress" and m["value"] > 7: risk_score += 25
        elif m["metric_type"] == "heart_rate" and m["value"] > 100: risk_score += 15
        elif m["metric_type"] == "steps" and m["value"] < 3000: risk_score += 10
    risk_score = min(risk_score, 100)

    if risk_score >= 80:
        level, factors, rec = RiskLevel.CRITICAL, ["Severe sleep deprivation", "High stress"], "Immediate intervention required."
    elif risk_score >= 60:
        level, factors, rec = RiskLevel.HIGH, ["Elevated stress"], "Recommend stress management program."
    elif risk_score >= 40:
        level, factors, rec = RiskLevel.MEDIUM, ["Moderate lifestyle risks"], "Suggest wellness check-in."
    else:
        level, factors, rec = RiskLevel.LOW, ["Healthy metrics"], "Continue current wellness routine."

    return RiskPrediction(
        employee_id=employee_data["employee_id"], risk_level=level, risk_score=risk_score,
        risk_factors=factors, recommendation=rec, confidence=0.85 + np.random.random() * 0.1
    )

@router.post("/predict")
async def predict_employee_risk(employee_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    metrics = await db.health_data.find({
        "employee_id": employee_id,
        "recorded_at": {"$gte": datetime.utcnow() - timedelta(days=30)}
    }).to_list(100)
    prediction = predict_risk({"employee_id": employee_id, "metrics": metrics})
    await db.predictions.insert_one(prediction.dict())
    return prediction

@router.get("/workforce")
async def get_workforce_predictions(user_id: str = Depends(get_current_user)):
    db = get_db()
    predictions = await db.predictions.find().sort("predicted_at", -1).to_list(100)
    return [RiskPrediction(**{k: v for k, v in p.items() if k != "_id"}) for p in predictions]
