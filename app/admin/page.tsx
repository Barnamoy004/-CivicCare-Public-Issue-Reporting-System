"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllReports,
  deleteReport,
  updateReportStatus,
  resetDemoData,
} from "@/lib/storage";
import {
  Report,
  IssueStatus,
  IssuePriority,
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  IssueCategory,
} from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import CategoryIcon from "@/components/CategoryIcon";
import {
  Search,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  BarChart2,
  ClipboardList,
  RefreshCw,
  AlertTriangle,
  X,
  Save,
  Eye,
  RotateCcw,
} from "lucide-react";

function SortIcon({
  field,
  sortField,
  sortAsc,
}: {
  field: string;
  sortField: string;
  sortAsc: boolean;
}) {
  if (sortField !== field) return <ChevronDown size={13} className="text-gray-300" />;
  return sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

const ADMIN_PASSWORD = "demo123";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface EditState {
  reportId: string;
  status: IssueStatus;
  priority: IssuePriority;
  note: string;
}

interface StatsData {
  total: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  categoryMap: Record<string, number>;
}

function computeStats(reports: Report[]): StatsData {
  const categoryMap: Record<string, number> = {};
  for (const r of reports) {
    categoryMap[r.category] = (categoryMap[r.category] ?? 0) + 1;
  }
  return {
    total: reports.length,
    submitted: reports.filter((r) => r.status === "Submitted").length,
    underReview: reports.filter((r) => r.status === "Under Review").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
    rejected: reports.filter((r) => r.status === "Rejected").length,
    categoryMap,
  };
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0, submitted: 0, underReview: 0, inProgress: 0, resolved: 0, rejected: 0, categoryMap: {},
  });

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "">("");
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt" | "priority">("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">("dashboard");

  function loadReports() {
    const all = getAllReports();
    Promise.resolve().then(() => {
      setReports(all);
      setStats(computeStats(all));
    });
  }

  useEffect(() => {
    if (authed) {
      const all = getAllReports();
      Promise.resolve().then(() => {
        setReports(all);
        setStats(computeStats(all));
      });
    }
  }, [authed]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Use: demo123");
    }
  }

  function handleDelete(id: string) {
    deleteReport(id);
    loadReports();
    setDeleteConfirm(null);
    showToast("Report deleted.");
  }

  function handleEditSave() {
    if (!editState) return;
    const updated = updateReportStatus(
      editState.reportId,
      editState.status,
      editState.note,
      editState.priority
    );
    if (updated) {
      loadReports();
      setEditState(null);
      showToast("Report updated successfully.");
    } else {
      showToast("Failed to update report.", "error");
    }
  }

  function handleReset() {
    resetDemoData();
    window.location.reload();
  }

  const priorityOrder: Record<IssuePriority, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

  const filtered = reports
    .filter((r) => {
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortField === "createdAt") diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      else if (sortField === "updatedAt") diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      else if (sortField === "priority") diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return sortAsc ? -diff : diff;
    });

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(false); }
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart2 size={24} className="text-emerald-700" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Enter the demo password to continue.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800">
            <strong>Demo Access Only.</strong> Client-side password protection does not provide real security.{" "}
            Password: <span className="font-mono font-bold">demo123</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter demo password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-emerald-500"
                autoComplete="current-password"
              />
              {authError && (
                <p className="text-xs text-red-600 mt-1.5">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors text-sm min-h-[48px]"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 min-h-[36px] flex items-center justify-center">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...Object.values(stats.categoryMap), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast — constrained width, safe margins */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border ${
          toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {editState && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Update Report</h2>
              <button
                onClick={() => setEditState(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={editState.status}
                  onChange={(e) => setEditState({ ...editState, status: e.target.value as IssueStatus })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-emerald-500 bg-white"
                >
                  {ISSUE_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select
                  value={editState.priority}
                  onChange={(e) => setEditState({ ...editState, priority: e.target.value as IssuePriority })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-emerald-500 bg-white"
                >
                  {ISSUE_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Administrator Note</label>
                <textarea
                  value={editState.note}
                  onChange={(e) => setEditState({ ...editState, note: e.target.value })}
                  rows={3}
                  placeholder="Add a note about the status change or action taken…"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditState(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-3 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Save size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 w-full sm:max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900">Delete Report?</h2>
                <p className="text-xs text-gray-500 font-mono truncate">{deleteConfirm}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              This action cannot be undone. The report will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 min-h-[48px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 w-full sm:max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <RotateCcw size={20} className="text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Reset Demo Data?</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              This will delete all reports and restore the original sample data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 min-h-[48px]"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Admin header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">CivicCare Report Management</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadReports}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-[40px]"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-amber-200 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors min-h-[40px]"
            >
              <RotateCcw size={14} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Demo notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 sm:mb-6 text-xs text-amber-800">
          <strong>Demo Mode.</strong> This admin panel is for demonstration only. All data is stored in browser localStorage.
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-fit mb-5 sm:mb-6">
          {(["dashboard", "reports"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors min-h-[40px] ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "dashboard" ? "Overview" : "Manage Reports"}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-5 sm:space-y-6">
            {/* Stats Grid — 3-col on mobile, 6-col on lg */}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {[
                { label: "Total", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
                { label: "Submitted", value: stats.submitted, color: "text-blue-700", bg: "bg-blue-50" },
                { label: "Review", value: stats.underReview, color: "text-yellow-700", bg: "bg-yellow-50" },
                { label: "In Progress", value: stats.inProgress, color: "text-orange-700", bg: "bg-orange-50" },
                { label: "Resolved", value: stats.resolved, color: "text-emerald-700", bg: "bg-emerald-50" },
                { label: "Rejected", value: stats.rejected, color: "text-red-700", bg: "bg-red-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 sm:p-4 border border-gray-100`}>
                  <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h2 className="font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
                <BarChart2 size={16} />
                Category Distribution
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(stats.categoryMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center gap-2 sm:gap-3">
                      {/* Label: icon always, text hidden on xs */}
                      <div className="flex items-center gap-1.5 w-6 sm:w-44 shrink-0">
                        <CategoryIcon category={category as IssueCategory} />
                        <span className="text-xs text-gray-700 truncate hidden sm:inline">{category}</span>
                      </div>
                      <div className="flex-1 h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-5 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                  <ClipboardList size={16} />
                  Recent Reports
                </h2>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="text-xs text-emerald-700 hover:underline min-h-[36px] flex items-center"
                >
                  Manage all →
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[...reports]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                          {r.id} · {formatDate(r.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge status={r.status} size="sm" />
                        <button
                          onClick={() => setEditState({ reportId: r.id, status: r.status, priority: r.priority, note: "" })}
                          className="p-2 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          aria-label="Edit report"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Manage Reports tab ── */}
        {activeTab === "reports" && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-5">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search by title, ID, or location…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IssueStatus | "")}
                    className="px-3 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white sm:min-w-[150px]"
                    aria-label="Filter by status"
                  >
                    <option value="">All Statuses</option>
                    {ISSUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as IssueCategory | "")}
                    className="px-3 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white sm:min-w-[160px]"
                    aria-label="Filter by category"
                  >
                    <option value="">All Categories</option>
                    {["Roads and Potholes", "Waste Management", "Streetlights", "Drainage and Waterlogging", "Water Supply", "Public Property", "Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{filtered.length} report{filtered.length !== 1 ? "s" : ""} shown</p>
            </div>

            {/* Mobile: card list. Desktop: table */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-400">
                No reports match the current filters.
              </div>
            ) : (
              <>
                {/* Mobile card list (hidden on lg+) */}
                <div className="lg:hidden space-y-3">
                  {filtered.map((r) => (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm leading-snug">{r.title}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{r.id}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link
                            href={`/reports/${r.id}`}
                            className="p-2 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="View report"
                            target="_blank"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => setEditState({ reportId: r.id, status: r.status, priority: r.priority, note: "" })}
                            className="p-2 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Edit report"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(r.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Delete report"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <StatusBadge status={r.status} size="sm" />
                        <PriorityBadge priority={r.priority} />
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                          <CategoryIcon category={r.category} />
                          <span className="truncate max-w-[100px]">{r.category}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{r.location}</span>
                        <span>{formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table (hidden on mobile) */}
                <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">ID</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Title</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Category</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            <button className="flex items-center gap-1 hover:text-gray-900" onClick={() => toggleSort("priority")}>
                              Priority <SortIcon field="priority" sortField={sortField} sortAsc={sortAsc} />
                            </button>
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            <button className="flex items-center gap-1 hover:text-gray-900" onClick={() => toggleSort("createdAt")}>
                              Submitted <SortIcon field="createdAt" sortField={sortField} sortAsc={sortAsc} />
                            </button>
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            <button className="flex items-center gap-1 hover:text-gray-900" onClick={() => toggleSort("updatedAt")}>
                              Updated <SortIcon field="updatedAt" sortField={sortField} sortAsc={sortAsc} />
                            </button>
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filtered.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono text-xs text-gray-500">{r.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-800 max-w-[200px] truncate">{r.title}</p>
                              {r.reporterName && (
                                <p className="text-xs text-gray-400 mt-0.5">{r.reporterName}</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <CategoryIcon category={r.category} />
                                <span>{r.category}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <PriorityBadge priority={r.priority} />
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={r.status} size="sm" />
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(r.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(r.updatedAt)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/reports/${r.id}`}
                                  className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                                  aria-label="View"
                                  target="_blank"
                                >
                                  <Eye size={14} />
                                </Link>
                                <button
                                  onClick={() => setEditState({ reportId: r.id, status: r.status, priority: r.priority, note: "" })}
                                  className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                                  aria-label="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(r.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                  aria-label="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
