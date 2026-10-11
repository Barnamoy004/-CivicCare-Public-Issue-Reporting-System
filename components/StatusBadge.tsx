import { IssueStatus } from "@/lib/types";

const statusConfig: Record<
  IssueStatus,
  { label: string; classes: string }
> = {
  Submitted: {
    label: "Submitted",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  "Under Review": {
    label: "Under Review",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  "In Progress": {
    label: "In Progress",
    classes: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  Resolved: {
    label: "Resolved",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Rejected: {
    label: "Rejected",
    classes: "bg-red-50 text-red-700 border border-red-200",
  },
};

interface StatusBadgeProps {
  status: IssueStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig["Submitted"];
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${config.classes}`}>
      {config.label}
    </span>
  );
}
