"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const methods = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      await login(values);
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
        <Card>
          <CardHeader>
            <h1 className="text-center text-2xl font-semibold tracking-tight text-neutral-100">
              Entrar
            </h1>
          </CardHeader>
          <CardContent>
            <Form<FormValues> methods={methods} onSubmit={onSubmit}>
              <div className="space-y-4">
                <FormField<FormValues>
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  disabled={isLoading}
                  data-cy="login-email"
                />
                <FormField<FormValues>
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  data-cy="login-password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-cy="login-submit"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Entrando...
                    </div>
                  ) : (
                    "Continuar"
                  )}
                </Button>
                <p className="text-center text-xs text-neutral-400">
                  Não tem conta?{" "}
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-1 text-neutral-200 underline"
                    onClick={() => router.push("/register")}
                  >
                    Criar conta
                  </Button>
                </p>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </AuthGuard>
  );
}
