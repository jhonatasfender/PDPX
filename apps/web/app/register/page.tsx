"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Mail, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const methods = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      await register(values);
      
      setRegisteredEmail(values.email);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Erro no registro:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (showSuccessMessage) {
    return (
      <AuthGuard requireAuth={false}>
        <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="text-center text-2xl font-semibold tracking-tight text-neutral-100">
                Conta Criada!
              </h1>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="success">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 text-green-400" />
                    <div>
                      <p className="font-medium">Verifique seu e-mail</p>
                      <p className="text-sm mt-1">
                        Enviamos um link de confirmação para <strong>{registeredEmail}</strong>
                      </p>
                      <p className="text-sm mt-2">
                        Clique no link para ativar sua conta e poder fazer login.
                      </p>
                    </div>
                  </div>
                </Alert>
                
                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-neutral-200 underline cursor-pointer hover:text-neutral-100"
                  >
                    Ir para o login
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
              Criar Conta
            </h1>
          </CardHeader>
          <CardContent>
            <Form<FormValues> methods={methods} onSubmit={onSubmit}>
              <div className="space-y-4">
                <FormField<FormValues>
                  name="name"
                  label="Nome"
                  type="text"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  disabled={isLoading}
                />
                <FormField<FormValues>
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
                <FormField<FormValues>
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Criando conta...
                    </div>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
                <p className="text-center text-xs text-neutral-400">
                  Já tem conta?{" "}
                  <Link href="/login" className="text-neutral-200 underline cursor-pointer">
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
