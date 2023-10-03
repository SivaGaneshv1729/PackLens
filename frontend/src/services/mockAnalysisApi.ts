import { seedResults, templateResult } from "@/data/mockData";
import { readStorage, writeStorage } from "@/services/mockStorage";
import type { ComplianceResult, PackageRecord } from "@/types/compliance";

const resultsKey = "results";

export function listResults(): ComplianceResult[] {
  const stored = readStorage<ComplianceResult[]>(resultsKey, []);
  if (stored.length === 0) {
    writeStorage(resultsKey, seedResults);
    return seedResults;
  }
  return stored;
}

export async function startPackageAnalysis(packageRecord: PackageRecord): Promise<string> {
  await new Promise((resolve) => window.setTimeout(resolve, 250));
  const analysisId = `ANL-${Date.now()}`;
  const result: ComplianceResult = {
    ...templateResult,
    analysisId,
    analyzedAt: new Date().toISOString(),
    package: { ...templateResult.package, ...packageRecord },
    checks: templateResult.checks.map((check) => ({ ...check })),
    violations: templateResult.violations.map((violation) => ({ ...violation })),
  };
  writeStorage(resultsKey, [result, ...listResults()]);
  return analysisId;
}

export function getResult(analysisId: string): ComplianceResult | undefined {
  return listResults().find((result) => result.analysisId === analysisId);
}

export function getResultByPackage(packageId: string): ComplianceResult | undefined {
  return listResults().find((result) => result.package.id === packageId);
}

export function getDashboardSnapshot() {
  const results = listResults();
  return {
    stats: {
      totalPackages: results.length,
      compliantPackages: results.filter((result) => result.status === "compliant").length,
      nonCompliantPackages: results.filter((result) => result.status === "non_compliant").length,
      totalViolations: results.reduce((total, result) => total + result.violations.length, 0),
      complianceRate: results.length ? Math.round((results.filter((result) => result.status === "compliant").length / results.length) * 100) : 0,
    },
    trend: [62, 68, 65, 74, 78, 76, 84, 81, 87, 89, 92, 88],
    violationCategories: [
      { label: "Label declarations", value: 34 },
      { label: "MRP & pricing", value: 24 },
      { label: "Quantity format", value: 18 },
      { label: "Consumer care", value: 14 },
      { label: "Other", value: 10 },
    ],
  };
}