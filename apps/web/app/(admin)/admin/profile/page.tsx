import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const user = {
    name: "Jonatas Developer",
    email: "jonatas@example.com",
    role: "Administrador",
    lastLogin: "2025-09-24 14:32",
    twoFactorEnabled: false,
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundType=gradientLinear&radius=50&fontSize=40&scale=90",
  } as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 p-5 md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-neutral-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-neutral-100">
                {user.name}
              </div>
              <div className="truncate text-sm text-neutral-400">
                {user.email}
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" size="sm">
                Editar perfil
              </Button>
              <Button size="sm">Alterar senha</Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs text-neutral-500">Função</div>
              <div className="text-neutral-200">{user.role}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Último acesso</div>
              <div className="text-neutral-200">{user.lastLogin}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">2FA</div>
              <div className="text-neutral-200">
                {user.twoFactorEnabled ? "Ativado" : "Desativado"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 p-5">
          <div className="mb-3 text-sm text-neutral-300">Ações rápidas</div>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="sm">
              Atualizar avatar
            </Button>
            <Button variant="secondary" size="sm">
              Gerenciar 2FA
            </Button>
            <Button variant="danger" size="sm">
              Sair de todas as sessões
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
