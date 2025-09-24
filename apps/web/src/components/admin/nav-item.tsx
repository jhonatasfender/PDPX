"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cn } from "../../lib/cn";

type Props = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export function AdminNavItem({ href, label, icon: Icon }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900",
        active && "bg-neutral-900 text-neutral-100",
      )}
    >
      <Icon size={16} /> {label}
    </Link>
  );
}
