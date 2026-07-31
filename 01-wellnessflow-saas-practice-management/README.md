# WellnessFlow — SaaS Practice Management

> All-in-one practice management for health & wellness professionals

## Features
- Landing page with pricing tiers
- Authentication (JWT)
- Dashboard with analytics (Recharts)
- Client management with progress tracking
- Appointment scheduling & management
- Billing & invoicing with Stripe
- Settings with profile, notifications, security, billing, branding

## Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + Recharts
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Payments:** Stripe (subscriptions & one-time payments)
- **DevOps:** Docker Compose

## Quick Start
```bash
# Infrastructure
docker-compose up -d postgres redis

# Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new practitioner |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/clients | List clients |
| POST | /api/clients | Create client |
| GET | /api/appointments | List appointments |
| POST | /api/appointments | Create appointment |
| GET | /api/invoices | List invoices |
| POST | /api/invoices | Create invoice |
| GET | /api/analytics/dashboard | Dashboard metrics |
| GET | /api/analytics/revenue | Revenue over time |
| POST | /api/subscriptions/checkout | Stripe checkout |
| POST | /api/subscriptions/cancel | Cancel subscription |

## Demo Credentials
- Email: `demo@wellnessflow.com`
- Password: `password123`
