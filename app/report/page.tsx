"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createReport } from "@/lib/storage";
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, IssuePriority, IssueCategory } from "@/lib/types";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  FileImage,
} from "lucide-react";

interface FormData {
  title: string;
  description: string;
  category: IssueCategory | "";
  location: string;
  reporterName: string;
  priority: IssuePriority;
  imageDataUrl: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  image?: string;
}

const MAX_IMAGE_SIZE_MB = 2;

/* Shared class for all text inputs/selects — text-base ensures 16px on iOS (no zoom) */
const inputCls = (hasError: boolean) =>
  `w-full px-3.5 py-3 rounded-lg border text-base outline-none transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-emerald-500"
  }`;

export default function ReportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    reporterName: "",
    priority: "Medium",
    imageDataUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Issue title is required.";
    else if (form.title.trim().length < 10) e.title = "Title must be at least 10 characters.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (form.description.trim().length < 30) e.description = "Description must be at least 30 characters.";
    if (!form.location.trim()) e.location = "Location is required.";
    return e;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPEG, PNG, WebP, or GIF images are allowed." }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.` }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: undefined }));
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, imageDataUrl: result }));
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImagePreview("");
    setImageName("");
    setForm((prev) => ({ ...prev, imageDataUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const report = createReport({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category as IssueCategory,
        location: form.location.trim(),
        reporterName: form.reporterName.trim() || undefined,
        priority: form.priority,
        imageDataUrl: form.imageDataUrl || undefined,
      });
      setSubmittedId(report.id);
    } catch {
      setErrors({ title: "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function copyId() {
    if (!submittedId) return;
    await navigator.clipboard.writeText(submittedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (submittedId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your report has been received. Use the report ID below to track its
            status.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-2 font-medium">Your Report ID</p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono font-bold text-base sm:text-lg text-emerald-700 tracking-wider break-all">
                {submittedId}
              </span>
              <button
                onClick={copyId}
                className="p-2.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                title="Copy ID"
                aria-label="Copy report ID"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Save this ID. You can use it on the Track Report page to check for status updates.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/reports/${submittedId}`}
              className="px-5 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors text-sm min-h-[48px] flex items-center justify-center"
            >
              View My Report
            </Link>
            <Link
              href="/reports"
              className="px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm min-h-[48px] flex items-center justify-center"
            >
              Browse All Reports
            </Link>
            <button
              onClick={() => {
                setSubmittedId(null);
                setForm({ title: "", description: "", category: "", location: "", reporterName: "", priority: "Medium", imageDataUrl: "" });
                setImagePreview("");
                setImageName("");
              }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Submit another report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-5 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 min-h-[44px]"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Report an Issue</h1>
          <p className="text-gray-500 text-sm mt-1">
            Help your community by reporting a public infrastructure problem.
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8 space-y-5 sm:space-y-6" noValidate>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Large pothole on Main Road near Bus Stop 5"
              className={inputCls(!!errors.title)}
              autoComplete="off"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputCls(!!errors.category)} bg-white appearance-none`}
            >
              <option value="">Select a category</option>
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the problem in detail. Include relevant information about severity, duration, and any safety concerns."
              className={`${inputCls(!!errors.description)} resize-none`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">{form.description.length} chars</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
              Location / Area <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Main Road, Near Bus Stop 5, Sector 3"
              className={inputCls(!!errors.location)}
              autoComplete="street-address"
            />
            {errors.location && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* Priority and Reporter Name — stack on mobile, side-by-side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 text-base outline-none bg-white transition-colors appearance-none"
              >
                {ISSUE_PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="reporterName"
                name="reporterName"
                type="text"
                value={form.reporterName}
                onChange={handleChange}
                placeholder="Leave blank to remain anonymous"
                className="w-full px-3.5 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 text-base outline-none transition-colors"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Photo <span className="text-gray-400 font-normal">(optional — max {MAX_IMAGE_SIZE_MB}MB)</span>
            </label>
            {imagePreview ? (
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 sm:max-h-52 w-full object-contain"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                    <FileImage size={13} className="shrink-0" />
                    <span className="truncate">{imageName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors shrink-0 min-h-[44px] px-2"
                  >
                    <X size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload a photo"
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  errors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                }`}
              >
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload a photo
                </p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF · Max {MAX_IMAGE_SIZE_MB}MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload photo file"
            />
            {errors.image && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.image}
              </p>
            )}
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm min-h-[48px]"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center px-4">
          By submitting, you confirm that this report is accurate to the best of your knowledge.
          Do not include personal contact information. CivicCare is a student demonstration project.
        </p>
      </div>
    </div>
  );
}
