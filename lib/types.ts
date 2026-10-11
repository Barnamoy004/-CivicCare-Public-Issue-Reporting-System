export type IssueCategory =
  | "Roads and Potholes"
  | "Waste Management"
  | "Streetlights"
  | "Drainage and Waterlogging"
  | "Water Supply"
  | "Public Property"
  | "Other";

export type IssueStatus =
  | "Submitted"
  | "Under Review"
  | "In Progress"
  | "Resolved"
  | "Rejected";

export type IssuePriority = "Low" | "Medium" | "High" | "Urgent";

export interface StatusHistoryEntry {
  status: IssueStatus;
  timestamp: string;
  note: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  imageDataUrl?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporterName?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes: string;
  statusHistory: StatusHistoryEntry[];
}

export type ReportInput = Pick<
  Report,
  "title" | "description" | "category" | "location" | "reporterName" | "priority"
> & {
  imageDataUrl?: string;
};

export const ISSUE_CATEGORIES: IssueCategory[] = [
  "Roads and Potholes",
  "Waste Management",
  "Streetlights",
  "Drainage and Waterlogging",
  "Water Supply",
  "Public Property",
  "Other",
];

export const ISSUE_STATUSES: IssueStatus[] = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

export const ISSUE_PRIORITIES: IssuePriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];
