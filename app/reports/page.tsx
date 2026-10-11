"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllReports } from "@/lib/storage";
import { Report, IssueCategory, IssueStatus, ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/types";
import ReportCard from "@/components/ReportCard";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";

const PAGE_SIZE = 9;

function BrowseReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allReports, setAllReports] = useState<Report[]>([]);
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "">(
    (searchParams.get("category") as IssueCategory) ?? ""
  );
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "">(
    (searchParams.get("status") as IssueStatus) ?? ""
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const data = getAllReports();
    Promise.resolve().then(() => setAllReports(data));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") as IssueCategory | null;
    if (cat) Promise.resolve().then(() => setCategoryFilter(cat));
  }, [searchParams]);

  const filtered = allReports
    .filter((r) => {
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter && r.category !== categoryFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function clearFilters() {
    setSearchText("");
    setCategoryFilter("");
    setStatusFilter("");
    setSortOrder("newest");
    setPage(1);
    router.replace("/reports");
  }

  const hasFilters = searchText || categoryFilter || statusFilter;

  /* Clamp visible page buttons to avoid overflow on narrow screens */
  function visiblePages(): number[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 1;
    const range: number[] = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    const pages = [1, ...range, totalPages];
    return [...new Set(pages)].sort((a, b) => a - b);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Browse Reports</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {filtered.length} report{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors min-h-[44px] self-start sm:self-auto"
          >
            + Report an Issue
          </Link>
        </div>

        {/* Filters — stacked on mobile, row on sm+ */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Search — full width */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by title or report ID…"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Category + Status + Sort — 2-col grid on mobile, row on sm+ */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value as IssueCategory | ""); setPage(1); }}
                className="px-3 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white transition-colors sm:min-w-[170px]"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as IssueStatus | ""); setPage(1); }}
                className="px-3 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white transition-colors sm:min-w-[150px]"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                {ISSUE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value as "newest" | "oldest"); setPage(1); }}
                className="col-span-2 sm:col-auto px-3 py-2.5 text-base border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white transition-colors sm:min-w-[130px]"
                aria-label="Sort order"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Active filter chips — wrap freely */}
          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500">Filters:</span>
              {searchText && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <span className="max-w-[120px] truncate">&quot;{searchText}&quot;</span>
                  <button
                    onClick={() => setSearchText("")}
                    aria-label="Remove search filter"
                    className="flex items-center"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <span className="max-w-[120px] truncate">{categoryFilter}</span>
                  <button
                    onClick={() => setCategoryFilter("")}
                    aria-label="Remove category filter"
                    className="flex items-center"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    aria-label="Remove status filter"
                    className="flex items-center"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 ml-1 min-h-[28px]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Report Grid / Empty state */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 sm:py-20 text-center px-4">
            <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No reports found</h3>
            <p className="text-sm text-gray-400">
              {hasFilters
                ? "Try adjusting your filters or search terms."
                : "No reports have been submitted yet."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-emerald-700 hover:underline min-h-[44px] px-4"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
              {paginated.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>

            {/* Pagination — smart window to avoid overflow */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <ChevronLeft size={16} />
                </button>

                {visiblePages().map((p, idx, arr) => (
                  <span key={p} className="contents">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-gray-400 text-sm px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "bg-emerald-700 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseReportsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Loading…</div>}>
      <BrowseReportsContent />
    </Suspense>
  );
}
