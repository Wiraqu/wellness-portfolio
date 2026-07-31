from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class HealthMetricType(str, Enum):
    HEART_RATE = "heart_rate"
    BLOOD_PRESSURE = "blood_pressure"
    SLEEP = "sleep"
    STEPS = "steps"
    MOOD = "mood"
    STRESS = "stress"
    WEIGHT = "weight"

class HealthDataPoint(BaseModel):
    employee_id: str
    metric_type: HealthMetricType
    value: float
    unit: str
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
    source: str = "manual"
    notes: Optional[str] = None

class RiskPrediction(BaseModel):
    employee_id: str
    risk_level: RiskLevel
    risk_score: float = Field(..., ge=0, le=100)
    risk_factors: List[str]
    predicted_at: datetime = Field(default_factory=datetime.utcnow)
    recommendation: str
    confidence: float = Field(..., ge=0, le=1)

class Alert(BaseModel):
    id: Optional[str] = None
    employee_id: str
    alert_type: str
    severity: RiskLevel
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved: bool = False
    resolved_at: Optional[datetime] = None

class DashboardMetrics(BaseModel):
    total_employees: int
    at_risk_count: int
    avg_wellness_score: float
    interventions_sent: int
    risk_distribution: dict
