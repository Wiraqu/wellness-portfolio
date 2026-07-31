# VitalSync — AI Health Risk Prediction

> AI-powered workforce health monitoring and risk prediction platform

## Features
- Landing page with enterprise positioning
- Real-time dashboard with risk distribution charts
- AI risk prediction engine (simulated ML)
- Workforce health data ingestion
- Automated alerts for high-risk employees
- Wellness dimension radar charts
- Intervention tracking

## Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + Recharts
- **Backend:** Python FastAPI + Motor (async MongoDB)
- **AI:** scikit-learn architecture (simulated predictions)
- **Database:** MongoDB
- **DevOps:** Docker Compose

## Quick Start
```bash
# Infrastructure
docker-compose up -d mongodb

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register HR admin |
| POST | /api/auth/login | Login |
| POST | /api/health-data/ | Submit health data |
| GET | /api/health-data/employee/{id} | Employee history |
| POST | /api/predictions/predict | Run AI prediction |
| GET | /api/predictions/workforce | All predictions |
| GET | /api/alerts/ | Active alerts |
| PATCH | /api/alerts/{id}/resolve | Resolve alert |
| GET | /api/dashboard/metrics | Dashboard KPIs |
| GET | /api/dashboard/occupancy | Trend data |

## AI Risk Scoring Logic
The simulated model evaluates:
- Sleep < 6h → +20 risk points
- Stress > 7/10 → +25 risk points
- Heart Rate > 100 → +15 risk points
- Steps < 3000 → +10 risk points

Risk Levels: Low (<40), Medium (40-59), High (60-79), Critical (80+)
