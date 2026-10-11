"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { Menu, X, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/reports", label: "Browse Reports" },
  { href: "/report", label: "Report an Issue" },
  { href: "/track", label: "Track Report" },
  { href: "/about", label: "About" },
];

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === link.href
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function NavContent() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        <NavLinks pathname={pathname} />
        <Link
          href="/admin"
          className="ml-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-md hover:bg-emerald-800 transition-colors"
        >
          Admin
        </Link>
      </div>

      {/* Mobile hamburger — 44×44 touch target */}
      <button
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu — full-width dropdown below header */}
      {menuOpen && (
        <>
          {/* Backdrop to close on outside tap */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50"
            aria-label="Mobile navigation"
          >
            <div className="px-3 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center min-h-[44px] px-4 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-emerald-700 hover:text-emerald-800 transition-colors shrink-0"
          >
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            CivicCare
          </Link>

          <Suspense
            fallback={
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <span key={link.href} className="px-3 py-2 text-sm text-gray-400">
                    {link.label}
                  </span>
                ))}
              </div>
            }
          >
            <NavContent />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
