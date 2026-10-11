import { IssuePriority } from "@/lib/types";

const priorityConfig: Record<IssuePriority, { label: string; classes: string }> = {
  Low: { label: "Low", classes: "bg-gray-100 text-gray-600 border border-gray-200" },
  Medium: { label: "Medium", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  High: { label: "High", classes: "bg-orange-50 text-orange-700 border border-orange-200" },
  Urgent: { label: "Urgent", classes: "bg-red-50 text-red-700 border border-red-200" },
};

interface PriorityBadgeProps {
  priority: IssuePriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] ?? priorityConfig["Medium"];
  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 ${config.classes}`}>
      {config.label}
    </span>
  );
}
