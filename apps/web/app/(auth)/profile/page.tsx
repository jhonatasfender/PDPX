"use client";

import { useAuth } from "@/contexts/auth.context";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-100">
        Meu Perfil
      </h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-neutral-100">
            Informações da Conta
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300">Nome</label>
            <p className="text-neutral-100">{user?.name || "Não informado"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">
              E-mail
            </label>
            <p className="text-neutral-100">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">
              Tipo de Conta
            </label>
            <p className="text-neutral-100">
              {user?.role === "ADMIN" ? "Administrador" : "Usuário"}
            </p>
          </div>

          <div className="pt-4">
            <Button variant="secondary" onClick={logout} className="w-full">
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
