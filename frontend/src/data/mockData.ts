import type { ComplianceCheck, ComplianceResult, PackageRecord } from "@/types/compliance";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

export const demoPackageImages = [
  "https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1698376621004-70ce754157d1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1637087788835-4f051e32bfa1?auto=format&fit=crop&w=900&q=85",
];

const packageOne: PackageRecord = {
  id: "PKG-2026-001",
  productName: "Organic Multi-Grain Flour",
  manufacturer: "Nourish Foods India Pvt Ltd",
  category: "Food & Agriculture",
  imageUrl: demoPackageImages[0],
  fileType: "image/jpeg",
  fileName: "organic-multigrain-flour.jpg",
  fileSize: 248000,
  mrp: "₹280.00 (Incl. of all taxes)",
  netQuantity: "5 kg",
  uploadedAt: daysAgo(0),
};

const packageTwo: PackageRecord = {
  id: "PKG-2026-002",
  productName: "Premia Roasted Almonds",
  manufacturer: "NutriCraft Snacks Co",
  category: "Packaged Snacks",
  imageUrl: demoPackageImages[1],
  fileType: "image/jpeg",
  fileName: "premia-roasted-almonds.jpg",
  fileSize: 319000,
  mrp: "₹450",
  netQuantity: "500 g",
  uploadedAt: daysAgo(2),
};

const packageThree: PackageRecord = {
  id: "PKG-2026-003",
  productName: "Cold Pressed Sunflower Oil",
  manufacturer: "Harvest & Co.",
  category: "Cooking Oils",
  imageUrl: demoPackageImages[2],
  fileType: "image/jpeg",
  fileName: "sunflower-oil-pack.jpg",
  fileSize: 286000,
  mrp: "₹190.00 (Incl. of all taxes)",
  netQuantity: "1 L",
  uploadedAt: daysAgo(5),
};

const passedChecks: ComplianceCheck[] = [
  { id: "manufacturer", requirement: "Manufacturer / Packer Name", applicable: true, status: "passed", detectedValue: "Nourish Foods India Pvt Ltd", reason: "Name is visible on the package label." },
  { id: "address", requirement: "Manufacturer / Packer Address", applicable: true, status: "passed", detectedValue: "Pune, Maharashtra, India", reason: "A complete address was detected." },
  { id: "generic-name", requirement: "Generic Name of Commodity", applicable: true, status: "passed", detectedValue: "Organic Multi-Grain Flour", reason: "Commodity name matches the product label." },
  { id: "quantity", requirement: "Net Quantity", applicable: true, status: "passed", detectedValue: "5 kg", reason: "Quantity and unit are clearly stated." },
  { id: "mrp", requirement: "Maximum Retail Price (MRP)", applicable: true, status: "passed", detectedValue: "₹280.00 (Incl. of all taxes)", reason: "MRP is shown in the expected format." },
  { id: "date", requirement: "Date of Manufacture / Packing", applicable: true, status: "passed", detectedValue: "Packed: 02/2026", reason: "Packing month and year were detected." },
  { id: "consumer-care", requirement: "Consumer Care Details", applicable: true, status: "passed", detectedValue: "care@nourishfoods.example", reason: "Consumer contact information is visible." },
  { id: "origin", requirement: "Country of Origin", applicable: false, status: "not_applicable", reason: "The package is marked as domestic in the supplied analysis." },
];

const failedChecks: ComplianceCheck[] = [
  { id: "manufacturer", requirement: "Manufacturer / Packer Name", applicable: true, status: "passed", detectedValue: "NutriCraft Snacks Co", reason: "Name is visible on the package label." },
  { id: "address", requirement: "Manufacturer / Packer Address", applicable: true, status: "passed", detectedValue: "Not provided", reason: "A partial address was detected." },
  { id: "generic-name", requirement: "Generic Name of Commodity", applicable: true, status: "passed", detectedValue: "Roasted Almonds", reason: "Commodity name is clearly stated." },
  { id: "quantity", requirement: "Net Quantity", applicable: true, status: "passed", detectedValue: "500 g", reason: "Quantity and unit are clearly stated." },
  { id: "mrp", requirement: "Maximum Retail Price (MRP)", applicable: true, status: "failed", detectedValue: "₹450", reason: "Mandatory inclusive-tax wording was not detected.", recommendation: "Display the MRP with the applicable inclusive-tax declaration." },
  { id: "date", requirement: "Date of Manufacture / Packing", applicable: true, status: "warning", detectedValue: "Packed: 2026", reason: "The year was detected but the month was not clear.", recommendation: "Show both the month and year of packing." },
  { id: "consumer-care", requirement: "Consumer Care Details", applicable: true, status: "failed", detectedValue: "No consumer care information found", reason: "No contact email or phone number was detected.", recommendation: "Add a consumer care phone number or email address." },
  { id: "origin", requirement: "Country of Origin", applicable: false, status: "not_applicable", reason: "No import indicator was returned by the analysis." },
];

const reviewChecks: ComplianceCheck[] = [
  { id: "manufacturer", requirement: "Manufacturer / Packer Name", applicable: true, status: "passed", detectedValue: "Harvest & Co.", reason: "Name is visible on the package label." },
  { id: "address", requirement: "Manufacturer / Packer Address", applicable: true, status: "warning", detectedValue: "Mumbai, India", reason: "Address is present but some characters were low confidence.", recommendation: "Verify the printed address before distribution." },
  { id: "generic-name", requirement: "Generic Name of Commodity", applicable: true, status: "passed", detectedValue: "Sunflower Oil", reason: "Commodity name is clearly stated." },
  { id: "quantity", requirement: "Net Quantity", applicable: true, status: "passed", detectedValue: "1 L", reason: "Quantity and unit are clearly stated." },
  { id: "mrp", requirement: "Maximum Retail Price (MRP)", applicable: true, status: "passed", detectedValue: "₹190.00 (Incl. of all taxes)", reason: "MRP is shown in the expected format." },
  { id: "date", requirement: "Date of Manufacture / Packing", applicable: true, status: "warning", detectedValue: "Not provided", reason: "The analysis could not confidently read the packing date.", recommendation: "Confirm the packing date is printed and legible." },
  { id: "consumer-care", requirement: "Consumer Care Details", applicable: true, status: "passed", detectedValue: "1800-000-000", reason: "Consumer contact information is visible." },
  { id: "origin", requirement: "Country of Origin", applicable: false, status: "not_applicable", reason: "The supplied analysis did not mark the item as imported." },
];

export const seedResults: ComplianceResult[] = [
  {
    analysisId: "ANL-2026-001",
    package: packageOne,
    status: "compliant",
    score: 98,
    summary: { totalChecks: 7, passed: 7, failed: 0, warnings: 0 },
    checks: passedChecks,
    violations: [],
    analyzedAt: daysAgo(0),
  },
  {
    analysisId: "ANL-2026-002",
    package: packageTwo,
    status: "non_compliant",
    score: 62,
    summary: { totalChecks: 7, passed: 4, failed: 2, warnings: 1 },
    checks: failedChecks,
    violations: [
      { id: "mrp-format", title: "MRP format needs review", severity: "medium", detectedInformation: "₹450", requiredInformation: "MRP should include the applicable inclusive-tax declaration.", recommendation: "Update the printed MRP declaration before the next packaging run.", location: { x: 44, y: 52, width: 30, height: 14 } },
      { id: "consumer-care-missing", title: "Consumer care details missing", severity: "high", detectedInformation: "No consumer care information found", requiredInformation: "A consumer care phone number or email address.", recommendation: "Add a visible customer support contact to the package label.", location: null },
    ],
    analyzedAt: daysAgo(2),
  },
  {
    analysisId: "ANL-2026-003",
    package: packageThree,
    status: "review_required",
    score: 84,
    summary: { totalChecks: 7, passed: 5, failed: 0, warnings: 2 },
    checks: reviewChecks,
    violations: [
      { id: "date-review", title: "Packing date needs verification", severity: "low", detectedInformation: "Not provided", requiredInformation: "A legible month and year of manufacture or packing.", recommendation: "Verify the date panel on the physical package.", location: null },
    ],
    analyzedAt: daysAgo(5),
  },
];

export const templateResult = seedResults[1];