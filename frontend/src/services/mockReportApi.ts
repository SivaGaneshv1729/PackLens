import type { ComplianceResult } from "@/types/compliance";

function escapePdfText(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

export function getPdfDownload(result: ComplianceResult): { url: string; filename: string } {
  const lines = [
    "Package Compliance Analysis Report",
    "Compliance-assistance prototype — not a legally binding determination",
    "",
    `Product: ${result.package.productName}`,
    `Manufacturer: ${result.package.manufacturer ?? "Not provided"}`,
    `Category: ${result.package.category ?? "Not provided"}`,
    `MRP: ${result.package.mrp ?? "Not provided"}`,
    `Net quantity: ${result.package.netQuantity ?? "Not provided"}`,
    `Analysis date: ${new Date(result.analyzedAt).toLocaleString()}`,
    `Status: ${result.status.replaceAll("_", " ").toUpperCase()}`,
    `Score: ${result.score ?? "Not provided"}%`,
    "",
    "Checklist",
    ...result.checks.map((check) => `${check.requirement}: ${check.status.toUpperCase()} — ${check.detectedValue ?? "Not provided"}`),
    "",
    "Violations",
    ...(result.violations.length ? result.violations.map((violation) => `${violation.title} (${violation.severity}): ${violation.recommendation ?? "See analysis details"}`) : ["No violations returned"]),
    "",
    "Final regulatory determination remains subject to applicable rules and verification by the appropriate authority.",
  ];
  const stream = ["BT", "/F1 10 Tf", "50 760 Td", ...lines.map((line, index) => `${index ? "0 -14 Td" : ""} (${escapePdfText(line.slice(0, 110))}) Tj`), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return {
    url: `data:application/pdf;base64,${toBase64(pdf)}`,
    filename: `${result.package.productName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-compliance-report.pdf`,
  };
}

export function downloadPdfReport(result: ComplianceResult): void {
  const { url, filename } = getPdfDownload(result);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    document.body.removeChild(anchor);
  }, 1000);
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export async function shareReport(result: ComplianceResult): Promise<void> {
  const text = `Package Compliance Analysis Report — ${result.package.productName}`;
  if (navigator.share) {
    await navigator.share({ title: text, text });
    return;
  }
  await navigator.clipboard.writeText(`${text}\nStatus: ${result.status.replaceAll("_", " ")}\nScore: ${result.score ?? "Not provided"}%`);
}