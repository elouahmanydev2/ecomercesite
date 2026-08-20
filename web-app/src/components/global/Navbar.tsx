"use client";

import { useState, useRef, useEffect } from "react";
import { NAV_LINKS } from "@/lib/utils/constants";
import CartButton from "./cart/CartButton";
import { authClient } from "@/lib/authClient";
import { can } from "@/hooks/can";
import { PERMISSIONS } from "@/lib/auth/permissions";
interface NavbarProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role?: string | null;
    };
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userRole = user?.role as any;
  const hasDashboardAccess = userRole && can(userRole, PERMISSIONS.dashboard);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Call your client auth logout method (e.g. Better Auth / NextAuth)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <>
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-12">
        {/* Logo */}
        <span className="text-lg font-bold tracking-tight text-white">
          link<span className="text-violet-400">store</span>
        </span>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-3">
          <CartButton />

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm text-white font-medium hover:opacity-90 focus:outline-none"
              >
                <span className="rounded-full bg-violet-600 px-3 py-1.5 text-xs text-white">
                  {user.name || user.email || "User"}
                </span>
              </button>

              {/* User Dropdown Dialog */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-zinc-900 border border-white/10 p-2 shadow-xl z-50 flex flex-col gap-1 text-sm text-white">
                  <div className="px-3 py-2 border-b border-white/10 text-xs text-white/50 truncate">
                    {user.email}
                  </div>

                  {hasDashboardAccess && (
                    <a
                      href="/dashboard"
                      className="px-3 py-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Log in
            </a>
          )}
        </div>

        {/* Mobile right side — cart + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <CartButton />
          <button
            className="text-white/60"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
              {open ? (
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h16M3 11h16M3 16h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="absolute top-16 left-0 right-0 bg-[#111] border-t border-white/10 px-6 py-4 flex flex-col gap-4 sm:hidden z-30">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/60 hover:text-white"
              >
                {l.label}
              </a>
            ))}

            {user ? (
              <>
                <span className="text-sm font-medium text-violet-400 pt-2 border-t border-white/10">
                  Logged in as: {user.name || user.email}
                </span>

                {hasDashboardAccess && (
                  <a
                    href="/dashboard"
                    className="rounded-lg bg-zinc-800 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Dashboard
                  </a>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600/80 hover:bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="mt-1 rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Login
              </a>
            )}
          </div>
        )}
      </nav>
    </>
  );
}