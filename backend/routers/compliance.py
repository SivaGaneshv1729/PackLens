from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import uuid
import shutil
from models.compliance import ComplianceResult, DashboardStats
from lib.analyzer import analyze_package_image

router = APIRouter(prefix="/compliance", tags=["compliance"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory database for objective testing without MongoDB
IN_MEMORY_DB: List[dict] = []

@router.post("/analyze", response_model=ComplianceResult)
async def analyze_package(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Save the file locally
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Read bytes for analysis
    with open(file_path, "rb") as f:
        image_bytes = f.read()
        
    # Analyze with Gemini
    try:
        result = analyze_package_image(image_bytes, filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
        
    # Save to in-memory DB
    IN_MEMORY_DB.append(result.model_dump())
    
    return result

@router.get("/results", response_model=List[ComplianceResult])
async def get_results():
    # Return sorted by analyzedAt descending
    sorted_results = sorted(IN_MEMORY_DB, key=lambda x: x.get("analyzedAt", ""), reverse=True)
    return [ComplianceResult(**r) for r in sorted_results]

@router.get("/results/{analysis_id}", response_model=ComplianceResult)
async def get_result(analysis_id: str):
    for r in IN_MEMORY_DB:
        if r.get("analysisId") == analysis_id:
            return ComplianceResult(**r)
    raise HTTPException(status_code=404, detail="Result not found")

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    total = len(IN_MEMORY_DB)
    compliant = sum(1 for r in IN_MEMORY_DB if r.get("status") == "compliant")
    non_compliant = sum(1 for r in IN_MEMORY_DB if r.get("status") in ["non_compliant", "review_required"])
    
    total_violations = 0
    for r in IN_MEMORY_DB:
        total_violations += len(r.get("violations", []))
        
    compliance_rate = (compliant / total * 100) if total > 0 else 0
    
    return DashboardStats(
        totalPackages=total,
        compliantPackages=compliant,
        nonCompliantPackages=non_compliant,
        totalViolations=total_violations,
        complianceRate=round(compliance_rate, 1)
    )
