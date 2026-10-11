"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getReportById } from "@/lib/storage";
import { Report } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import CategoryIcon from "@/components/CategoryIcon";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Hash,
  Clock,
  AlertCircle,
  ImageIcon,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700 border-blue-200",
  "Under Review": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "In Progress": "bg-orange-100 text-orange-700 border-orange-200",
  Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

function ReportDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<Report | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const found = getReportById(id);
      Promise.resolve().then(() => setReport(found));
    }
  }, [id]);

  if (report === undefined) {
    return (
      <div className="flex items-center justify-center min-h-96 text-gray-400 text-sm">
        Loading…
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-sm w-full text-center">
          <AlertCircle size={36} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-sm text-gray-500 mb-5">
            No report exists with ID{" "}
            <span className="font-mono font-semibold break-all">{id}</span>.
          </p>
          <Link
            href="/reports"
            className="inline-block px-5 py-3 bg-emerald-700 text-white font-medium text-sm rounded-lg hover:bg-emerald-800 transition-colors min-h-[48px] flex items-center justify-center"
          >
            Browse All Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5 sm:mb-6 min-h-[44px]"
        >
          <ArrowLeft size={15} />
          Back to Reports
        </Link>

        {report.status === "Resolved" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 sm:mb-5 flex items-start gap-2 text-sm text-emerald-700">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            This issue has been marked as resolved.
          </div>
        )}
        {report.status === "Rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 sm:mb-5 flex items-start gap-2 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            This report was reviewed and rejected. See administrator notes for details.
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5 sm:mb-6">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <CategoryIcon category={report.category} />
                {report.category}
              </div>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3 sm:mb-4">
              {report.title}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Hash size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded break-all">
                  {report.id}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Calendar size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span>Submitted {formatDate(report.createdAt)}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="break-words">{report.location}</span>
              </div>
              {report.reporterName && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <User size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>{report.reporterName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {report.description}
            </p>
          </div>

          {/* Image */}
          {report.imageDataUrl && (
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <ImageIcon size={14} />
                Uploaded Photo
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.imageDataUrl}
                alt="Issue photo"
                className="rounded-xl max-h-60 sm:max-h-72 w-full object-contain bg-gray-50 border border-gray-100"
              />
            </div>
          )}

          {/* Admin Notes */}
          {report.adminNotes && (
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <MessageSquare size={14} />
                Administrator Notes
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 text-sm text-blue-900 leading-relaxed break-words">
                {report.adminNotes}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Last updated: {formatDateTime(report.updatedAt)}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span>Last updated: {formatDateTime(report.updatedAt)}</span>
            <Link
              href="/track"
              className="text-emerald-700 hover:underline font-medium min-h-[36px] flex items-center"
            >
              Track another report
            </Link>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-5 flex items-center gap-2">
            <Clock size={15} />
            Status History
          </h2>
          <ol className="relative border-l border-gray-200 ml-2 space-y-5 sm:space-y-6">
            {[...report.statusHistory].reverse().map((entry, i) => (
              <li key={i} className="ml-5 sm:ml-6">
                <span
                  className={`absolute -left-2.5 flex items-center justify-center w-5 h-5 rounded-full border-2 border-white ring-2 ring-gray-100 ${statusColors[entry.status]?.split(" ")[0] ?? "bg-gray-200"}`}
                />
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[entry.status] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {entry.status}
                  </span>
                  <time className="text-xs text-gray-400">{formatDateTime(entry.timestamp)}</time>
                </div>
                <p className="text-sm text-gray-600 break-words">{entry.note}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom actions */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/reports"
            className="flex-1 text-center px-5 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-[48px] flex items-center justify-center"
          >
            ← Back to Reports
          </Link>
          <Link
            href="/track"
            className="flex-1 text-center px-5 py-3 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors min-h-[48px] flex items-center justify-center"
          >
            Track Another Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportDetailsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Loading…</div>}>
      <ReportDetailsContent />
    </Suspense>
  );
}
