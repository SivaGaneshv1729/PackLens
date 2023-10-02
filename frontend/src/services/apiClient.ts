import { apiGet, apiPostForm } from "@/lib/api";
import type { ComplianceResult, DashboardStats, PackageRecord } from "@/types/compliance";

export const getResults = () => apiGet<ComplianceResult[]>("/compliance/results");
export const getResult = (id: string) => apiGet<ComplianceResult>(`/compliance/results/${id}`);
export const getDashboardStats = () => apiGet<DashboardStats>("/compliance/dashboard");
