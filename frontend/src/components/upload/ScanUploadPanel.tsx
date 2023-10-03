import type { DragEvent, RefObject } from "react";
import { ArrowRight, FileImage, FileText, ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";

interface ScanUploadPanelProps {
  inputRef: RefObject<HTMLInputElement | null>;
  file: File | null;
  preview: string;
  dragging: boolean;
  uploading: boolean;
  productName: string;
  manufacturer: string;
  category: string;
  onFile: (file: File | undefined) => void;
  onDraggingChange: (dragging: boolean) => void;
  onRemove: () => void;
  onProductNameChange: (value: string) => void;
  onManufacturerChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAnalyze: () => void;
  onCancel: () => void;
}

export default function ScanUploadPanel({
  inputRef,
  file,
  preview,
  dragging,
  uploading,
  productName,
  manufacturer,
  category,
  onFile,
  onDraggingChange,
  onRemove,
  onProductNameChange,
  onManufacturerChange,
  onCategoryChange,
  onAnalyze,
  onCancel,
}: ScanUploadPanelProps) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDraggingChange(false);
    onFile(event.dataTransfer.files[0]);
  };

  return (
    <div data-testid="upload-page" className="mx-auto max-w-4xl space-y-6">
      <header>
        <p data-testid="upload-eyebrow" className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">New screening</p>
        <h1 data-testid="upload-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Scan a Product</h1>
        <p data-testid="upload-description" className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Upload a clear image of the product label to begin compliance screening.</p>
      </header>

      <div data-testid="upload-flow-guide" className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        <span className="text-blue-600">Upload</span><ArrowRight className="size-3.5" aria-hidden="true" />
        <span>Analyze</span><ArrowRight className="size-3.5" aria-hidden="true" />
        <span>Get result</span>
      </div>

      <section data-testid="upload-card" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.06)]">
        <input data-testid="package-file-input" ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />
        <div
          data-testid="upload-dropzone"
          onDragOver={(event) => { event.preventDefault(); onDraggingChange(true); }}
          onDragLeave={() => onDraggingChange(false)}
          onDrop={handleDrop}
          className={`m-5 flex min-h-80 flex-col items-center justify-center border-2 border-dashed px-6 text-center transition-colors sm:m-7 ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50/60"}`}
        >
          {file ? (
            <div className="w-full max-w-2xl">
              <div className="grid items-center gap-6 sm:grid-cols-[220px_1fr] sm:text-left">
                {preview ? (
                  <img data-testid="package-image-preview" src={preview} alt="Selected product label preview" className="mx-auto aspect-square w-full max-w-[220px] object-cover ring-1 ring-slate-200" />
                ) : (
                  <div data-testid="package-pdf-preview" className="mx-auto flex aspect-square w-full max-w-[220px] flex-col items-center justify-center bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                    <FileText className="size-12" aria-hidden="true" />
                    <span className="mt-3 text-xs font-bold uppercase tracking-wider">PDF document</span>
                  </div>
                )}
                <div className="min-w-0">
                  <span data-testid="upload-success-state" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600"><span className="size-2 rounded-full bg-emerald-500" />Ready to analyze</span>
                  <h2 data-testid="selected-file-name" className="mt-3 truncate font-heading text-xl font-semibold text-slate-900">{file.name}</h2>
                  <p data-testid="selected-file-size" className="mt-1 text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "document"}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button data-testid="replace-file-button" type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"><RefreshCw className="size-3.5" />Replace</button>
                    <button data-testid="remove-file-button" type="button" onClick={onRemove} className="inline-flex h-9 items-center gap-2 border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="size-3.5" />Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <span className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600"><UploadCloud className="size-7" aria-hidden="true" /></span>
              <h2 data-testid="upload-dropzone-title" className="mt-5 font-heading text-xl font-semibold text-slate-900">Upload Product Image</h2>
              <p data-testid="upload-dropzone-instruction" className="mt-2 text-sm font-medium text-slate-600">Drag &amp; drop your image here</p>
              <span data-testid="upload-or-label" className="my-3 text-xs uppercase tracking-wider text-slate-400">or</span>
              <button data-testid="choose-file-button" type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-11 items-center gap-2 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"><ImagePlus className="size-4" />Browse Files</button>
              <p data-testid="upload-supported-files" className="mt-4 text-xs text-slate-400">JPG, JPEG, PNG or PDF · Maximum 10 MB</p>
            </>
          )}
        </div>

        <div data-testid="upload-metadata-form" className="border-t border-slate-100 px-5 py-6 sm:px-7">
          <div className="mb-4"><h2 data-testid="upload-metadata-title" className="font-heading text-base font-semibold text-slate-900">Optional product details</h2><p data-testid="upload-metadata-description" className="mt-1 text-xs text-slate-500">Add context if it is already known. Extracted declarations still come from the analysis response.</p></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label data-testid="product-name-label" htmlFor="product-name" className="mb-2 block text-xs font-semibold text-slate-700">Product name</label><input data-testid="product-name-input" id="product-name" value={productName} onChange={(event) => onProductNameChange(event.target.value)} placeholder="e.g. Herbal detergent" className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
            <div><label data-testid="manufacturer-label" htmlFor="manufacturer" className="mb-2 block text-xs font-semibold text-slate-700">Manufacturer / Packer</label><input data-testid="manufacturer-input" id="manufacturer" value={manufacturer} onChange={(event) => onManufacturerChange(event.target.value)} placeholder="Company or packer name" className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
            <div><label data-testid="category-label" htmlFor="category" className="mb-2 block text-xs font-semibold text-slate-700">Product category</label><input data-testid="category-input" id="category" value={category} onChange={(event) => onCategoryChange(event.target.value)} placeholder="e.g. Home care" className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button data-testid="upload-cancel-button" type="button" onClick={onCancel} className="h-11 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button data-testid="analyze-package-button" type="button" onClick={onAnalyze} disabled={uploading} className="inline-flex h-12 items-center justify-center gap-2 bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] hover:bg-blue-700 disabled:opacity-60">{uploading ? <Loader2 className="size-4 animate-spin" /> : <FileImage className="size-4" />}{uploading ? "Preparing product…" : "Analyze Product"}</button>
        </div>
      </section>

      <div data-testid="upload-guidance" className="flex items-start gap-3 border-l-2 border-blue-500 bg-blue-50/60 px-4 py-3 text-sm leading-6 text-blue-900"><FileImage className="mt-0.5 size-4 shrink-0 text-blue-600" /><p>For best results, use a clear, well-lit image where the product declarations are readable. PDF files remain supported.</p></div>
    </div>
  );
}