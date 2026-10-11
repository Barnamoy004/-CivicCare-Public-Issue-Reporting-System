import { Report, IssueStatus, IssuePriority, StatusHistoryEntry } from "./types";

const STORAGE_KEY = "civiccare_reports";
const INITIALIZED_KEY = "civiccare_initialized";

function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "CC-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function safeParseReports(raw: string | null): Report[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r) =>
        r &&
        typeof r.id === "string" &&
        typeof r.title === "string" &&
        typeof r.status === "string"
    );
  } catch {
    return [];
  }
}

export function getAllReports(): Report[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParseReports(raw);
}

export function getReportById(id: string): Report | null {
  const reports = getAllReports();
  return reports.find((r) => r.id === id) ?? null;
}

export function saveReport(report: Report): void {
  if (typeof window === "undefined") return;
  const reports = getAllReports();
  const idx = reports.findIndex((r) => r.id === report.id);
  if (idx >= 0) {
    reports[idx] = report;
  } else {
    reports.push(report);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReport(id: string): void {
  if (typeof window === "undefined") return;
  const reports = getAllReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function createReport(input: {
  title: string;
  description: string;
  category: string;
  location: string;
  reporterName?: string;
  priority: IssuePriority;
  imageDataUrl?: string;
}): Report {
  const now = new Date().toISOString();
  const id = generateId();
  const initialEntry: StatusHistoryEntry = {
    status: "Submitted",
    timestamp: now,
    note: "Report submitted by user.",
  };
  const report: Report = {
    id,
    title: input.title,
    description: input.description,
    category: input.category as Report["category"],
    location: input.location,
    reporterName: input.reporterName?.trim() || undefined,
    priority: input.priority,
    imageDataUrl: input.imageDataUrl,
    status: "Submitted",
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
    statusHistory: [initialEntry],
  };
  saveReport(report);
  return report;
}

export function updateReportStatus(
  id: string,
  status: IssueStatus,
  note: string,
  priority?: IssuePriority
): Report | null {
  const report = getReportById(id);
  if (!report) return null;
  const now = new Date().toISOString();
  const entry: StatusHistoryEntry = {
    status,
    timestamp: now,
    note: note.trim() || `Status changed to ${status}.`,
  };
  const updated: Report = {
    ...report,
    status,
    priority: priority ?? report.priority,
    adminNotes: note.trim() || report.adminNotes,
    updatedAt: now,
    statusHistory: [...report.statusHistory, entry],
  };
  saveReport(updated);
  return updated;
}

export function updateReportAdmin(
  id: string,
  fields: { adminNotes?: string; priority?: IssuePriority }
): Report | null {
  const report = getReportById(id);
  if (!report) return null;
  const now = new Date().toISOString();
  const updated: Report = {
    ...report,
    adminNotes: fields.adminNotes ?? report.adminNotes,
    priority: fields.priority ?? report.priority,
    updatedAt: now,
  };
  saveReport(updated);
  return updated;
}

export function isInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(INITIALIZED_KEY) === "true";
}

export function markInitialized(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INITIALIZED_KEY, "true");
}

export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(INITIALIZED_KEY);
}
