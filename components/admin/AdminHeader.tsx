"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth-actions";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-40">
      <button
        onClick={() => logout()}
        className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </header>
  );
}
