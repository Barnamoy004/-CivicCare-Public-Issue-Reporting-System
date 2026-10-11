"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getReportById } from "@/lib/storage";
import { Report } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import CategoryIcon from "@/components/CategoryIcon";
import { Search, AlertCircle, MapPin, Calendar, CheckCircle, Clock } from "lucide-react";

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

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get("id") ?? "";

  const [inputId, setInputId] = useState(initialId);
  const [searched, setSearched] = useState(!!initialId);
  const [report, setReport] = useState<Report | null | undefined>(
    initialId ? getReportById(initialId) : undefined
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputId.trim().toUpperCase();
    if (!trimmed) return;
    const found = getReportById(trimmed);
    setReport(found ?? null);
    setSearched(true);
    router.replace(`/track?id=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Track Your Report</h1>
          <p className="text-gray-500 text-sm">
            Enter your report ID to check the current status and any updates.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5 sm:mb-6">
          <label htmlFor="track-id" className="block text-sm font-medium text-gray-700 mb-2">
            Report ID
          </label>
          {/* Stack on narrow screens, row on sm+ */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              id="track-id"
              type="text"
              inputMode="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              placeholder="e.g. CC-DEMO0000 or CC-ABCD1234"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-emerald-500 transition-colors font-mono uppercase"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-700 text-white font-medium text-sm rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Search size={15} />
              Track
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your report ID was shown after submitting. It starts with &quot;CC-&quot;.
          </p>
        </form>

        {/* Not found */}
        {searched && report === null && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center">
            <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">Report Not Found</h3>
            <p className="text-sm text-gray-500">
              No report found with ID{" "}
              <span className="font-mono font-semibold break-all">{inputId}</span>.
              Check the ID and try again.
            </p>
          </div>
        )}

        {/* Result */}
        {report && (
          <div className="space-y-4 sm:space-y-5">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                    <CategoryIcon category={report.category} />
                    {report.category}
                  </div>
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority} />
                </div>
                <h2 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">{report.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="break-words">{report.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>Submitted {formatDate(report.createdAt)}</span>
                  </div>
                </div>
              </div>
              {report.adminNotes && (
                <div className="p-4 sm:p-5 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Administrator Notes</p>
                  <p className="text-sm text-blue-900 break-words">{report.adminNotes}</p>
                </div>
              )}
              {report.status === "Resolved" && (
                <div className="p-3 sm:p-4 bg-emerald-50 border-t border-emerald-100 flex items-start gap-2 text-sm text-emerald-700">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" />
                  This issue has been resolved.
                </div>
              )}
              <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex justify-end">
                <Link
                  href={`/reports/${report.id}`}
                  className="text-sm text-emerald-700 font-medium hover:underline min-h-[36px] flex items-center"
                >
                  View full report →
                </Link>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                <Clock size={14} />
                Status Timeline
              </h3>
              <ol className="relative border-l border-gray-200 ml-2 space-y-4 sm:space-y-5">
                {[...report.statusHistory].reverse().map((entry, i) => (
                  <li key={i} className="ml-5">
                    <span className={`absolute -left-2.5 w-5 h-5 rounded-full border-2 border-white ring-2 ring-gray-100 ${statusColors[entry.status]?.split(" ")[0] ?? "bg-gray-200"}`} />
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[entry.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {entry.status}
                      </span>
                      <time className="text-xs text-gray-400">{formatDateTime(entry.timestamp)}</time>
                    </div>
                    <p className="text-sm text-gray-600 break-words">{entry.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have a report yet?{" "}
            <Link href="/report" className="text-emerald-700 font-medium hover:underline">
              Submit one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-96 text-gray-400 text-sm">Loading…</div>}>
      <TrackContent />
    </Suspense>
  );
}
