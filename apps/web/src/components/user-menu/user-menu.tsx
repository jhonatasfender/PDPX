"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth.context";
import { MenuList, type MenuItem as MenuListItem } from "./menu-list";
import { If } from "@/components/ui/if";

interface MenuItem extends MenuListItem {}

interface UserMenuProps {
  menuItems?: MenuItem[];
  logoutRedirectTo?: string;
}

export function UserMenu({
  menuItems = [
    { label: "Perfil", href: "/profile" },
    { label: "Meus Pedidos", href: "/pedidos" },
  ],
  logoutRedirectTo = "/login",
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push(logoutRedirectTo);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        variant="secondary"
        size="sm"
        className="h-8 w-8 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900 p-0"
        data-cy="user-menu-trigger"
      >
        <span className="sr-only">Abrir menu do usuário</span>
        <Avatar
          name={user.name}
          email={user.email}
          size="sm"
          className="h-full w-full"
        />
      </Button>
      <If condition={open}>
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-44 rounded-md border border-neutral-800 bg-neutral-950 p-1 shadow-lg",
          )}
          data-cy="user-menu-dropdown"
        >
          <div className="px-3 py-2 text-xs">
            <div className="font-medium text-neutral-100">
              {user.name || user.email}
            </div>
            <div className="truncate text-neutral-500">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-neutral-800" />
          <MenuList
            items={menuItems}
            role={user.role}
            onItemClick={(item) => {
              setOpen(false);
              item.onClick?.();
            }}
          />
          <button
            className="block w-full rounded-sm px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-900"
            role="menuitem"
            data-cy="user-menu-logout"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </If>
    </div>
  );
}
