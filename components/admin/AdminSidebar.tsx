"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  MapPin,
  Compass,
  LayoutDashboard,
  Flag,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Trips", href: "/admin/trips", icon: Compass },
    { label: "Locations", href: "/admin/locations", icon: MapPin },
    { label: "Reports", href: "/admin/reports", icon: Flag },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 mb-4 bg-blue-50/50">
          <Link href="/admin" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-white"
                      : "group-hover:text-blue-600 transition-colors",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </div>
    </aside>
  );
}
