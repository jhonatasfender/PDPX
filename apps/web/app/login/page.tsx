"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const methods = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Futuramente: chamar API Nest /v1/auth/sign-in
    console.log("login:", values);
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-neutral-100">
        Entrar
      </h1>
      <Form<FormValues> methods={methods} onSubmit={onSubmit}>
        <div className="space-y-4">
          <FormField<FormValues>
            name="email"
            label="E-mail"
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
          />
          <FormField<FormValues>
            name="password"
            label="Senha"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full">
            Continuar
          </Button>
          <p className="text-center text-xs text-neutral-400">
            Não tem conta?{" "}
            <Link href="#" className="text-neutral-200 underline">
              Criar conta
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}
