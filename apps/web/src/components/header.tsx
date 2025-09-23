import Link from "next/link";
import { Armchair, ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-neutral-100">
          <Armchair size={20} />
          <span className="text-sm font-semibold tracking-tight">PDPX</span>
        </Link>

        <form className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 md:flex">
          <Search size={16} className="text-neutral-400" />
          <input
            aria-label="Buscar produtos"
            placeholder="Buscar produtos..."
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
          />
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <Link href="/carrinho">
            <Button variant="secondary" size="sm" className="gap-2">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Carrinho</span>
            </Button>
          </Link>
          <Button
            aria-label="Menu"
            variant="secondary"
            size="sm"
            className="sm:hidden p-2"
          >
            <Menu size={16} />
          </Button>
        </nav>
      </div>
    </header>
  );
}
