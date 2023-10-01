import os
from google import genai
from google.genai import types
from PIL import Image
import io
import json
from models.compliance import ComplianceResult, PackageRecord, ComplianceCheck, Violation, ComplianceSummary, ViolationLocation
import uuid
from datetime import datetime

def analyze_package_image(image_bytes: bytes, filename: str) -> ComplianceResult:
    # Try all 5 Gemini API keys in sequence
    api_keys = [
        os.environ.get(f"GEMINI_API_KEY_{i}") for i in range(1, 6)
    ]
    api_keys = [key for key in api_keys if key] # filter out None
    if not api_keys:
        api_keys = [os.environ.get("GEMINI_API_KEY")] # fallback to original if list is empty

    # Load image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Define the schema we expect the model to return
    schema = {
        "type": "OBJECT",
        "properties": {
            "productName": {"type": "STRING"},
            "manufacturer": {"type": "STRING", "description": "Manufacturer or Packer Name"},
            "category": {"type": "STRING"},
            "mrp": {"type": "STRING", "description": "Maximum Retail Price (MRP)"},
            "netQuantity": {"type": "STRING"},
            "checks": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "id": {"type": "STRING", "description": "One of: manufacturer, address, generic-name, quantity, mrp, date, consumer-care, origin"},
                        "requirement": {"type": "STRING"},
                        "applicable": {"type": "BOOLEAN"},
                        "status": {"type": "STRING", "description": "passed, failed, warning, or not_applicable"},
                        "detectedValue": {"type": "STRING"},
                        "reason": {"type": "STRING"},
                        "recommendation": {"type": "STRING"}
                    },
                    "required": ["id", "requirement", "applicable", "status"]
                }
            }
        },
        "required": ["productName", "checks"]
    }

    prompt = """
    Analyze this packaging image for compliance with legal metrology rules.
    Extract the product name, manufacturer name, category (e.g. Food, Cosmetics), MRP, and Net Quantity.
    
    Then perform the following 8 compliance checks:
    1. manufacturer: Is the Manufacturer / Packer Name present?
    2. address: Is the Manufacturer / Packer Address present and complete?
    3. generic-name: Is the Generic Name of Commodity stated?
    4. quantity: Is the Net Quantity stated with units?
    5. mrp: Is the Maximum Retail Price (MRP) stated, ideally with 'Inclusive of all taxes'?
    6. date: Is the Date of Manufacture or Packing present?
    7. consumer-care: Are Consumer Care Details (email/phone) present?
    8. origin: Is the Country of Origin stated (only required if imported, otherwise not_applicable)?
    
    For each check, determine the status (passed, failed, warning, or not_applicable). 
    Provide the detected value, a reason, and a recommendation if it failed or has a warning.
    Return strictly JSON following the specified schema.
    """

    response = None
    last_exception = None
    
    for key in api_keys:
        if not key: continue
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[image, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
            break # success
        except Exception as e:
            last_exception = e
            continue
            
    if response is None:
        raise Exception(f"All API keys failed. Last error: {last_exception}")
    
    data = json.loads(response.text)
    
    # Create models
    package = PackageRecord(
        productName=data.get("productName", "Unknown Product"),
        manufacturer=data.get("manufacturer"),
        category=data.get("category"),
        imageUrl=f"/api/uploads/{filename}",  # We will serve images from here
        fileType="image/jpeg",  # Assume JPEG for now
        fileName=filename,
        fileSize=len(image_bytes),
        mrp=data.get("mrp"),
        netQuantity=data.get("netQuantity")
    )
    
    checks = []
    violations = []
    passed = 0
    failed = 0
    warnings = 0
    
    for c in data.get("checks", []):
        check = ComplianceCheck(**c)
        checks.append(check)
        if check.status == "passed":
            passed += 1
        elif check.status == "failed":
            failed += 1
            violations.append(Violation(
                title=f"Missing or Invalid: {check.requirement}",
                severity="high",
                detectedInformation=check.detectedValue,
                recommendation=check.recommendation
            ))
        elif check.status == "warning":
            warnings += 1
            violations.append(Violation(
                title=f"Potential Issue: {check.requirement}",
                severity="medium",
                detectedInformation=check.detectedValue,
                recommendation=check.recommendation
            ))
            
    status = "compliant"
    if failed > 0:
        status = "non_compliant"
    elif warnings > 0:
        status = "review_required"
        
    score = 100
    if len(checks) > 0:
        score = int((passed / len(checks)) * 100)
        
    summary = ComplianceSummary(
        totalChecks=len(checks),
        passed=passed,
        failed=failed,
        warnings=warnings
    )
    
    return ComplianceResult(
        package=package,
        status=status,
        score=score,
        summary=summary,
        checks=checks,
        violations=violations
    )
