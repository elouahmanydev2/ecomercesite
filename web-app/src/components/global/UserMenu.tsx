"use client";

import { authClient } from "@/lib/authClient";
import { useState, useRef, useEffect } from "react";

type UserMenuProps = {
  name: string;
  canAccessDashboard: boolean;
};

export default function UserMenu({
  name,
  canAccessDashboard,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white"
      >
        {name}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-3 w-44 rounded-lg border border-white/10 bg-[#111] py-2 shadow-lg">
          {canAccessDashboard && (
            <a
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </a>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/5 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}