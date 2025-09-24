"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { api } from "@/lib/http";
import { AuthGuard } from "@/components/auth-guard";

const schema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("Informe um e-mail válido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setIsSuccess(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || "Este email já está cadastrado";
        methods.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      } else if (error.response?.status === 400) {
        methods.setError("root", {
          type: "manual",
          message: "Dados inválidos. Verifique os campos e tente novamente.",
        });
      } else {
        const errorMessage = error.response?.data?.message || "Erro ao criar conta. Tente novamente.";
        methods.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthGuard requireAuth={false}>
        <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
          <Card>
            <CardHeader>
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
                  Conta criada com sucesso!
                </h1>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-neutral-300">
                  Enviamos um link de confirmação para o seu email. 
                  Verifique sua caixa de entrada e clique no link para ativar sua conta.
                </p>
                
                <Alert variant="info">
                  <p className="text-sm">
                    Não recebeu o email? Verifique sua pasta de spam ou{" "}
                    <button className="text-neutral-200 underline hover:text-white">
                      reenviar confirmação
                    </button>
                  </p>
                </Alert>
                
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="text-neutral-200 underline hover:text-white"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
        <Card>
          <CardHeader>
            <h1 className="text-center text-2xl font-semibold tracking-tight text-neutral-100">
              Criar conta
            </h1>
          </CardHeader>
          <CardContent>
            <Form<FormValues> methods={methods} onSubmit={onSubmit}>
              <div className="space-y-4">
                {methods.formState.errors.root && (
                  <Alert variant="error">
                    {methods.formState.errors.root.message}
                  </Alert>
                )}
                <FormField<FormValues>
                  name="name"
                  label="Nome"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  data-cy="register-name"
                />
                <FormField<FormValues>
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  data-cy="register-email"
                />
                <FormField<FormValues>
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  data-cy="register-password"
                />
                <FormField<FormValues>
                  name="confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  data-cy="register-confirm-password"
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-cy="register-submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Registrar"}
                </Button>
                <p className="text-center text-xs text-neutral-400">
                  Já tem conta?{" "}
                  <Link href="/login" className="text-neutral-200 underline">
                    Entrar
                  </Link>
                </p>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </AuthGuard>
  );
}
