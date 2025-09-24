"use client";
import { Boxes, LayoutDashboard, Package } from "lucide-react";
import { AdminNavItem } from "./nav-item";

export function AdminSidebar() {
  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produtos", icon: Package },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-neutral-800 p-4">
        <Boxes size={18} className="text-neutral-300" />
        <span className="text-sm font-semibold text-neutral-200">
          PDPX Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {nav.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
      <div className="border-t border-neutral-800 p-3 text-xs text-neutral-500">
        v0.1.0
      </div>
    </div>
  );
}
