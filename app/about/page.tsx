import Link from "next/link";
import {
  MapPin,
  ClipboardList,
  Search,
  CheckCircle,
  Users,
  Shield,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-emerald-900 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <MapPin size={26} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">About CivicCare</h1>
          <p className="text-emerald-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A community-driven platform that makes it easy to report, track, and
            resolve public infrastructure issues in your neighbourhood.
          </p>
        </div>
      </section>

      {/* What is CivicCare */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is CivicCare?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                CivicCare is a web-based public issue reporting system that allows
                residents to easily report infrastructure and community problems in
                their local area. From potholes and broken streetlights to overflowing
                garbage bins and waterlogging, CivicCare provides one organized place
                to submit, track, and resolve civic issues.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each submitted report receives a unique tracking ID, allowing
                anyone to check the current status of their issue without requiring
                a login or account. Administrators can review, update, and resolve
                reports through a management dashboard.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-semibold text-emerald-800 mb-4">Problems We Address</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Potholes and damaged road surfaces",
                  "Garbage accumulation and overflowing bins",
                  "Non-functional streetlights and safety hazards",
                  "Drainage blockages and waterlogging",
                  "Irregular or contaminated water supply",
                  "Damaged public property and parks",
                  "Other community infrastructure issues",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why We Built This</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Users size={20} className="text-emerald-700" />,
                title: "Fragmented Reporting",
                desc: "Residents often have no clear way to report local problems. Reports made informally through phone calls or social media get lost without follow-up.",
              },
              {
                icon: <Search size={20} className="text-emerald-700" />,
                title: "Lack of Transparency",
                desc: "Once a complaint is made, there is usually no way to know what happened to it. CivicCare provides a public status timeline for every report.",
              },
              {
                icon: <ClipboardList size={20} className="text-emerald-700" />,
                title: "No Centralized Record",
                desc: "Without a shared record, duplicate reports are common and prioritization becomes difficult. CivicCare organizes all reports in one place.",
              },
              {
                icon: <CheckCircle size={20} className="text-emerald-700" />,
                title: "Accountability Gap",
                desc: "CivicCare creates a visible record of reported issues and their resolution status, which encourages timely action.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How the Process Works</h2>
          <div className="space-y-5">
            {[
              { step: "01", title: "Submit a Report", desc: "A resident fills in the issue form with a title, category, description, location, and optional photo. No account or login is required." },
              { step: "02", title: "Get a Report ID", desc: "The system generates a unique Report ID (e.g. CC-ABCD1234) that the reporter can save to track their submission." },
              { step: "03", title: "Report Goes Live", desc: "The report is immediately visible on the public Browse Reports page for the community to see." },
              { step: "04", title: "Administrator Review", desc: "An administrator reviews the report, assigns a priority, and updates the status with notes as work progresses." },
              { step: "05", title: "Status Updates", desc: "Every status change is recorded in the report timeline — Submitted → Under Review → In Progress → Resolved." },
              { step: "06", title: "Resolution", desc: "When the issue is resolved, the report is marked Resolved and remains visible as a historical record. Reporters can check status anytime using their ID." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shrink-0 text-sm font-bold">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-amber-50 border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3">
            <Shield size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Project Disclaimer</h3>
              <p className="text-sm text-amber-900 leading-relaxed">
                CivicCare is a <strong>student project</strong> created as a demonstration
                of a civic technology platform. It is <strong>not officially connected to any
                government department, municipal authority, or public body</strong>. Reports
                submitted to this platform are not guaranteed to result in real-world action.
                No personal data is transmitted to any server — all information is stored
                locally in your browser. This project is intended for educational purposes
                and portfolio demonstration only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Expected Community Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
            {[
              { icon: <Users size={24} className="text-emerald-700" />, title: "Empowered Citizens", desc: "Residents have a simple, dignified way to raise problems rather than feeling helpless about civic issues." },
              { icon: <ClipboardList size={24} className="text-emerald-700" />, title: "Better Organization", desc: "Issues are categorized, prioritized, and tracked systematically rather than being scattered across multiple channels." },
              { icon: <CheckCircle size={24} className="text-emerald-700" />, title: "Visible Accountability", desc: "A public record of reported issues and their status creates natural accountability for timely resolution." },
            ].map((b) => (
              <div key={b.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech note */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-700 mb-1 text-sm">Technical Note</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                This application uses browser localStorage for data persistence. All reports are stored
                locally in your browser and are not shared with any server. Clearing browser data will
                remove all reports. The application is built with Next.js, TypeScript, and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-emerald-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to report an issue?</h2>
          <p className="text-emerald-200 text-sm mb-6">
            Help make your community better. It only takes a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-900 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm"
            >
              Submit a Report
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors text-sm"
            >
              Browse Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
