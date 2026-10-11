import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              CivicCare
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              A community-driven platform for reporting and tracking public
              infrastructure issues. Built to connect citizens with solutions.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              This is a student project / demonstration prototype. It is not
              officially connected to any government or municipal authority.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-white transition-colors"
                >
                  Browse Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-white transition-colors"
                >
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-white transition-colors"
                >
                  Track a Report
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About CivicCare
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © 2025 CivicCare. Student demonstration project.
          </p>
          <p className="text-xs text-gray-500">
            All data is stored locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
