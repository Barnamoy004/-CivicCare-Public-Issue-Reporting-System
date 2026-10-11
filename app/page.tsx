"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllReports } from "@/lib/storage";
import { Report, IssueCategory } from "@/lib/types";
import ReportCard from "@/components/ReportCard";
import {
  ArrowRight,
  ClipboardList,
  Search,
  CheckCircle,
  Construction,
  Trash2,
  Lightbulb,
  Waves,
  Droplets,
  Building2,
  HelpCircle,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";

const categories: { name: IssueCategory; icon: React.ReactNode; desc: string }[] = [
  { name: "Roads and Potholes", icon: <Construction size={22} />, desc: "Damaged roads, potholes, broken pavements" },
  { name: "Waste Management", icon: <Trash2 size={22} />, desc: "Overflowing bins, illegal dumping, littering" },
  { name: "Streetlights", icon: <Lightbulb size={22} />, desc: "Non-functional streetlights, safety hazards" },
  { name: "Drainage and Waterlogging", icon: <Waves size={22} />, desc: "Blocked drains, waterlogging after rain" },
  { name: "Water Supply", icon: <Droplets size={22} />, desc: "Irregular supply, contamination, leakages" },
  { name: "Public Property", icon: <Building2 size={22} />, desc: "Damaged parks, public infrastructure" },
  { name: "Other", icon: <HelpCircle size={22} />, desc: "Any other civic issue in your community" },
];

const steps = [
  {
    icon: <ClipboardList size={28} className="text-emerald-700" />,
    title: "Submit a Report",
    desc: "Fill in a simple form describing the problem, its location, and optionally upload a photo.",
  },
  {
    icon: <Search size={28} className="text-emerald-700" />,
    title: "Track Your Report",
    desc: "Use your unique report ID to check the current status and any administrator updates.",
  },
  {
    icon: <CheckCircle size={28} className="text-emerald-700" />,
    title: "See It Resolved",
    desc: "Reports are reviewed, prioritized, and updated. Stay informed throughout the process.",
  },
];

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0, categories: 0 });

  useEffect(() => {
    const all = getAllReports();
    const resolved = all.filter((r) => r.status === "Resolved").length;
    const inProgress = all.filter(
      (r) => r.status === "In Progress" || r.status === "Under Review"
    ).length;
    const uniqueCategories = new Set(all.map((r) => r.category)).size;
    Promise.resolve().then(() => {
      setReports(all);
      setStats({ total: all.length, resolved, inProgress, categories: uniqueCategories });
    });
  }, []);

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/40 border border-emerald-600/40 rounded-full px-3 py-1.5 text-xs sm:text-sm text-emerald-100 mb-5 sm:mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0"></span>
              Community Issue Reporting Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              Report. Track.{" "}
              <span className="text-emerald-300">Resolve.</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-100 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              CivicCare makes it easy to report public infrastructure problems in
              your community — from potholes to broken streetlights — and track
              them until they are fixed.
            </p>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors min-h-[48px] text-sm sm:text-base"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/reports"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700/50 border border-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors min-h-[48px] text-sm sm:text-base"
              >
                Browse Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — 2-col on xs, 4-col on md */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: "Total Reports", value: stats.total, icon: <ClipboardList size={20} className="text-emerald-700" /> },
              { label: "Resolved Issues", value: stats.resolved, icon: <CheckCircle size={20} className="text-emerald-700" /> },
              { label: "Being Addressed", value: stats.inProgress, icon: <TrendingUp size={20} className="text-emerald-700" /> },
              { label: "Categories Active", value: stats.categories, icon: <Users size={20} className="text-emerald-700" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 sm:p-4 rounded-xl bg-emerald-50/50">
                <div className="flex justify-center mb-1.5 sm:mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Three simple steps to get your issue noticed and resolved.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-5 sm:p-7 border border-gray-100 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 sm:mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Issue Categories</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">CivicCare handles a wide range of common civic problems.</p>
          </div>
          {/* 2 cols on xs/sm, 3 on md, 4 on lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/reports?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center text-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-2 sm:mb-3 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 leading-tight">{cat.name}</span>
                <span className="text-xs text-gray-400 leading-snug hidden sm:block">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Recent Reports</h2>
              <p className="text-gray-500 mt-1 text-xs sm:text-sm">Latest community-submitted issues.</p>
            </div>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-sm text-emerald-700 font-medium hover:underline shrink-0"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {recentReports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No reports yet. Be the first to report an issue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {recentReports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors text-sm min-h-[48px]"
            >
              Report an Issue in Your Area
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-14 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
            See a problem in your community?
          </h2>
          <p className="text-emerald-200 mb-6 sm:mb-7 text-sm leading-relaxed max-w-lg mx-auto">
            Don&apos;t wait. Submit a report and let the community know. Every
            report helps build a better-maintained public environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/report"
              className="px-7 py-3 bg-white text-emerald-900 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm min-h-[48px] inline-flex items-center justify-center"
            >
              Submit a Report
            </Link>
            <Link
              href="/track"
              className="px-7 py-3 border border-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors text-sm min-h-[48px] inline-flex items-center justify-center"
            >
              Track an Existing Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
