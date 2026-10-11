import { Report } from "@/lib/types";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import CategoryIcon from "./CategoryIcon";
import { MapPin, Calendar, User } from "lucide-react";

interface ReportCardProps {
  report: Report;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      href={`/reports/${report.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
          <CategoryIcon category={report.category} />
          <span>{report.category}</span>
        </div>
        <StatusBadge status={report.status} size="sm" />
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
        {report.title}
      </h3>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
        {report.description}
      </p>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} />
          <span className="truncate">{report.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{formatDate(report.createdAt)}</span>
          </div>
          {report.reporterName && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <User size={12} />
              <span>{report.reporterName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono">{report.id}</span>
        <span className="text-xs text-emerald-700 font-medium hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
}
