import { demoPackageImages, seedResults, templateResult } from "@/data/mockData";
import { readStorage, writeStorage } from "@/services/mockStorage";
import type { PackageRecord, PendingUpload } from "@/types/compliance";

const packagesKey = "packages";

export function listPackages(): PackageRecord[] {
  const stored = readStorage<PackageRecord[]>(packagesKey, []);
  if (stored.length === 0) {
    const seeded = seedResults.map((result) => result.package);
    writeStorage(packagesKey, seeded);
    return seeded;
  }
  return stored;
}

export async function createPackage(input: PendingUpload): Promise<PackageRecord> {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  const packageRecord: PackageRecord = {
    id: `PKG-${Date.now()}`,
    productName: input.productName.trim() || "Untitled package",
    manufacturer: input.manufacturer.trim() || undefined,
    category: input.category.trim() || "Uncategorized",
    imageUrl: input.imageUrl || demoPackageImages[0],
    fileType: input.fileType,
    fileName: input.fileName,
    fileSize: input.fileSize,
    uploadedAt: new Date().toISOString(),
  };
  writeStorage(packagesKey, [packageRecord, ...listPackages()]);
  return packageRecord;
}

export function getPackage(packageId: string): PackageRecord | undefined {
  return listPackages().find((item) => item.id === packageId);
}

export function getUploadTemplate(): PendingUpload {
  return {
    productName: "",
    manufacturer: "",
    category: "",
    imageUrl: templateResult.package.imageUrl,
    fileName: "",
    fileType: "image/jpeg",
    fileSize: 0,
  };
}