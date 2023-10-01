from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid

class UserAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullName: str
    email: str
    password: str
    accountType: Literal["normal", "authorized"]

class PackageRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    productName: str
    manufacturer: Optional[str] = None
    category: Optional[str] = None
    imageUrl: str
    fileType: str
    fileName: str
    fileSize: Optional[int] = None
    mrp: Optional[str] = None
    netQuantity: Optional[str] = None
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class ComplianceCheck(BaseModel):
    id: str
    requirement: str
    applicable: bool = True
    status: Literal["passed", "failed", "warning", "not_applicable"]
    detectedValue: Optional[str] = None
    reason: Optional[str] = None
    recommendation: Optional[str] = None

class ViolationLocation(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Violation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    severity: Literal["high", "medium", "low"]
    detectedInformation: Optional[str] = None
    requiredInformation: Optional[str] = None
    recommendation: Optional[str] = None
    location: Optional[ViolationLocation] = None

class ComplianceSummary(BaseModel):
    totalChecks: int
    passed: int
    failed: int
    warnings: int

class ComplianceResult(BaseModel):
    analysisId: str = Field(default_factory=lambda: f"ANL-{uuid.uuid4().hex[:8].upper()}")
    package: PackageRecord
    status: Literal["compliant", "non_compliant", "review_required"]
    score: Optional[int] = None
    summary: ComplianceSummary
    checks: List[ComplianceCheck]
    violations: List[Violation]
    analyzedAt: datetime = Field(default_factory=datetime.utcnow)

class DashboardStats(BaseModel):
    totalPackages: int
    compliantPackages: int
    nonCompliantPackages: int
    totalViolations: int
    complianceRate: float

class PendingUpload(BaseModel):
    productName: str
    manufacturer: str
    category: str
    imageUrl: str
    fileName: str
    fileType: str
    fileSize: int
