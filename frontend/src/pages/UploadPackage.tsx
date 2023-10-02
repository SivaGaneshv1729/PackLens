import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ScanUploadPanel from "@/components/upload/ScanUploadPanel";
import AnalysisProcess, { ANALYSIS_STEPS } from "@/components/analysis/AnalysisProcess";
import { apiPostForm } from "@/lib/api";

const supportedExtensions = ["jpg", "jpeg", "png", "pdf"];

export default function UploadPackage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [productName, setProductName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    let timer: number;
    if (uploading) {
      timer = window.setInterval(() => setAnalysisStep((current) => Math.min(current + 1, ANALYSIS_STEPS.length)), 1500);
    }
    return () => window.clearInterval(timer);
  }, [uploading]);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase() ?? "";
    if (!supportedExtensions.includes(extension)) { toast.error("Unsupported file", { description: "Please upload JPG, JPEG, PNG or PDF." }); return; }
    setFile(nextFile);
    if (nextFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : "");
      reader.readAsDataURL(nextFile);
    } else setPreview("");
    toast.success("File uploaded", { description: "Add optional product details before analysis." });
  };

  const removeFile = () => { setFile(null); setPreview(""); if (inputRef.current) inputRef.current.value = ""; toast.success("File removed"); };

  const submit = async () => {
    if (!file) { toast.error("Choose a package first", { description: "Add a JPG, JPEG, PNG or PDF to continue." }); return; }
    setUploading(true);
    setAnalysisStep(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiPostForm<{ analysisId: string }>("/compliance/analyze", formData);
      toast.success("Analysis completed", { description: "Your compliance result is ready." });
      navigate(`/results/${response.analysisId}`);
    } catch (e: any) { 
      toast.error("Analysis could not be completed", { description: e?.body?.detail || "Please try again." }); 
      setUploading(false);
    } 
  };

  if (uploading && file) {
    // Show the analysis progressive UI
    const mockPackageRecord = {
      id: "pending",
      productName: productName || file.name,
      manufacturer: manufacturer || "Unknown",
      category: category || "Unknown",
      imageUrl: preview,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    };
    return <AnalysisProcess packageRecord={mockPackageRecord} activeStep={analysisStep} />;
  }

  return <ScanUploadPanel inputRef={inputRef} file={file} preview={preview} dragging={dragging} uploading={uploading} productName={productName} manufacturer={manufacturer} category={category} onFile={handleFile} onDraggingChange={setDragging} onRemove={removeFile} onProductNameChange={setProductName} onManufacturerChange={setManufacturer} onCategoryChange={setCategory} onAnalyze={submit} onCancel={() => navigate("/dashboard")} />;
}