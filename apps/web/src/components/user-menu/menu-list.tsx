import Link from "next/link";
import type { UserRole } from "@pdpx/types";

export type MenuItem = {
  label: string;
  href: string;
  onClick?: () => void;
};

export function MenuList({
  items,
  role,
  onItemClick,
}: {
  items: MenuItem[];
  role: UserRole;
  onItemClick: (item: MenuItem) => void;
}) {
  const list =
    role === "ADMIN" || role === "SUPERADMIN"
      ? [{ label: "Admin", href: "/admin" }, ...items]
      : items;

  return (
    <>
      {list.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-sm px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
          role="menuitem"
          data-cy={`user-menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => onItemClick(item)}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
