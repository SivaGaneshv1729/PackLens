export type AccountType = "normal" | "authorized";
export type ComplianceStatus = "compliant" | "non_compliant" | "review_required";
export type CheckStatus = "passed" | "failed" | "warning" | "not_applicable";
export type Severity = "high" | "medium" | "low";

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  accountType: AccountType;
}

export interface PackageRecord {
  id: string;
  productName: string;
  manufacturer?: string;
  category?: string;
  imageUrl: string;
  fileType: string;
  fileName: string;
  fileSize?: number;
  mrp?: string;
  netQuantity?: string;
  uploadedAt: string;
}

export interface ComplianceCheck {
  id: string;
  requirement: string;
  applicable: boolean;
  status: CheckStatus;
  detectedValue?: string;
  reason?: string;
  recommendation?: string;
}

export interface ViolationLocation {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Violation {
  id: string;
  title: string;
  severity: Severity;
  detectedInformation?: string;
  requiredInformation?: string;
  recommendation?: string;
  location?: ViolationLocation | null;
}

export interface ComplianceSummary {
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
}

export interface ComplianceResult {
  analysisId: string;
  package: PackageRecord;
  status: ComplianceStatus;
  score?: number;
  summary: ComplianceSummary;
  checks: ComplianceCheck[];
  violations: Violation[];
  analyzedAt: string;
}

export interface DashboardStats {
  totalPackages: number;
  compliantPackages: number;
  nonCompliantPackages: number;
  totalViolations: number;
  complianceRate: number;
}

export interface PendingUpload {
  productName: string;
  manufacturer: string;
  category: string;
  imageUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}