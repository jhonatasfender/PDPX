"use client";
import { Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { UserMenu } from "../user-menu/user-menu";

type SearchForm = { query: string };

export function AdminTopbar() {
  const methods = useForm<SearchForm>({ defaultValues: { query: "" } });
  const onSubmit = ({ query }: SearchForm) => {
    void query;
  };
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="flex items-center gap-2 p-3 md:p-4">
        <Button variant="secondary" size="sm" className="md:hidden">
          <Menu size={16} />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Form<SearchForm> methods={methods} onSubmit={onSubmit}>
            <div className="hidden items-center gap-2 rounded-md border border-neutral-800 px-2.5 py-1.5 text-sm text-neutral-300 md:flex">
              <Search size={16} />
              <Input
                {...methods.register("query")}
                placeholder="Buscar..."
                className="h-7 w-56 border-0 bg-transparent px-0 py-0 focus:ring-0 placeholder:text-neutral-600"
              />
            </div>
          </Form>
          <UserMenu
            menuItems={[
              { label: "Perfil", href: "/admin/profile" },
              { label: "Configurações", href: "/admin/configuracoes" },
            ]}
            logoutRedirectTo="/"
          />
        </div>
      </div>
    </header>
  );
}
