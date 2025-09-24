import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-neutral-800 md:block">
          <AdminSidebar />
        </aside>
        <div className="flex min-h-screen flex-col">
          <AdminTopbar />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
