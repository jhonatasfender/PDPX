"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const logout = () => {
    router.push("/");
  };

  const user = { name: "Jonatas Developer", email: "jonatas@example.com" };

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
      >
        <span className="sr-only">Abrir menu do usuário</span>
        <img
          alt="Avatar"
          src="https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundType=gradientLinear&radius=50&fontSize=40&scale=90"
          className="h-full w-full object-cover"
        />
      </Button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-44 rounded-md border border-neutral-800 bg-neutral-950 p-1 shadow-lg",
          )}
        >
          <div className="px-3 py-2 text-xs">
            <div className="font-medium text-neutral-100">{user.name}</div>
            <div className="truncate text-neutral-500">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-neutral-800" />
          <Link
            href="/admin/profile"
            className="block rounded-sm px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Perfil
          </Link>
          <Link
            href="/admin/configuracoes"
            className="block rounded-sm px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Configurações
          </Link>
          <button
            className="block w-full rounded-sm px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-900"
            role="menuitem"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
