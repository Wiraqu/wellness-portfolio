from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    company_id: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(user: UserRegister):
    db = get_db()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["role"] = "hr_admin"
    user_dict["created_at"] = __import__("datetime").datetime.utcnow()

    result = await db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "email": user.email, "name": user.name}

@router.post("/login")
async def login(credentials: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}}
