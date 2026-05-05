from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
import uvicorn
import os
import secrets
import string
import datetime
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pathlib import Path

# Load environment variables
load_dotenv()

app = FastAPI(title="College Connect API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"], # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration
MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client[os.getenv("DB_NAME", "college_connect")]

users_collection = db.get_collection("users")
otp_collection = db.get_collection("email_otps")

# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "College Connect Support"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS", "True") == "True",
    VALIDATE_CERTS=os.getenv("VALIDATE_CERTS", "True") == "True"
)

# Pydantic models for ML
class RecommendationRequest(BaseModel):
    userId: str
    course: str
    subjects: list[str]
    progress: dict

# Pydantic models for Auth
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    university: Optional[str] = None
    course: Optional[str] = None
    branch: Optional[str] = None
    subjects: Optional[List[str]] = []

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

# Helper functions
def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_otp(length: int = 6):
    return ''.join(secrets.choice(string.digits) for _ in range(length))

async def send_otp_email(email: str, otp: str):
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #3b82f6; text-align: center;">College Connect Verification</h2>
        <p style="color: #475569; font-size: 16px;">Hello,</p>
        <p style="color: #475569; font-size: 16px;">Your verification code is:</p>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #cbd5e1; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">{otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">College Connect &copy; 2026</p>
    </div>
    """
    
    message = MessageSchema(
        subject="Your College Connect Account Verification Code",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

# Auth Endpoints
@app.post("/signup")
async def signup(request: SignupRequest, background_tasks: BackgroundTasks):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists with this email")

    # Hash password
    hashed_password = get_password_hash(request.password)

    # Create user entry (active)
    user_data = {
        "name": request.name,
        "email": request.email,
        "password": hashed_password,
        "university": request.university,
        "course": request.course,
        "branch": request.branch,
        "subjects": request.subjects,
        "isVerified": True,
        "createdAt": datetime.datetime.utcnow()
    }
    
    await users_collection.insert_one(user_data)

    return {"status": "success", "message": "Account created successfully", "email": request.email}

@app.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    # Retrieve OTP record
    otp_record = await otp_collection.find_one({"email": request.email})
    if not otp_record:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")

    # Check if expired
    if datetime.datetime.utcnow() > otp_record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    # Check for too many attempts (brute force protection)
    if otp_record.get("attempts", 0) >= 5:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Please request a new OTP.")

    # Check OTP correctness
    if otp_record["otp"] != request.otp:
        # Increment attempts
        await otp_collection.update_one(
            {"email": request.email},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Mark user as verified
    result = await users_collection.update_one(
        {"email": request.email},
        {"$set": {"isVerified": True}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the OTP record after verification
    await otp_collection.delete_one({"email": request.email})

    return {"status": "success", "message": "Account verified successfully"}

@app.post("/resend-otp")
async def resend_otp(request: ResendOTPRequest, background_tasks: BackgroundTasks):
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("isVerified"):
        return {"status": "success", "message": "Email is already verified"}

    # Limit resends - check last resend time
    otp_record = await otp_collection.find_one({"email": request.email})
    if otp_record and (datetime.datetime.utcnow() - otp_record["created_at"]).total_seconds() < 60:
        raise HTTPException(status_code=429, detail="Please wait 1 minute before requesting a new OTP")

    # Generate new OTP
    otp = generate_otp()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

    await otp_collection.update_one(
        {"email": request.email},
        {"$set": {"otp": otp, "created_at": datetime.datetime.utcnow(), "expires_at": expires_at}},
        upsert=True
    )

    # Send email in background
    background_tasks.add_task(send_otp_email, request.email, otp)

    return {"status": "success", "message": "New OTP sent to your email"}

# ML recommendation logic (existing)
RESOURCES_DB = [
    {"id": "v1", "type": "Video", "title": "Introduction to Algorithm Analysis", "subject": "Data Structures", "topic": "ds1"},
    {"id": "v2", "type": "Video", "title": "Process Scheduling Algorithms", "subject": "Operating Systems", "topic": "os2"},
    {"id": "n1", "type": "Notes", "title": "Unit 1 Summary", "subject": "Operating Systems", "topic": "os1"},
    {"id": "p1", "type": "PYQ", "title": "2023 Previous Year Paper", "subject": "Database Management", "topic": "db1"},
    {"id": "n2", "type": "Notes", "title": "Binary Search Trees", "subject": "Data Structures", "topic": "ds4"},
]

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to College Connect API"}

@app.get("/ml/health")
def health_check():
    return {"status": "healthy", "service": "ML Recommendation Engine"}

@app.post("/ml/recommendations")
def get_recommendations(req: RecommendationRequest):
    if not req.subjects:
        return {"status": "success", "recommendations": RESOURCES_DB[:2]}
    user_profile = " ".join(req.subjects)
    resource_docs = [f"{r['subject']} {r['title']}" for r in RESOURCES_DB]
    vectorizer = TfidfVectorizer()
    all_docs = [user_profile] + resource_docs
    tfidf_matrix = vectorizer.fit_transform(all_docs)
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    ranked_indices = cosine_sim.argsort()[::-1]
    top_recs = [RESOURCES_DB[i] for i in ranked_indices[:3] if cosine_sim[i] > 0]
    if not top_recs:
        top_recs = [r for r in RESOURCES_DB if r['subject'] in req.subjects][:3]
    return {"status": "success", "recommendations": top_recs}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
