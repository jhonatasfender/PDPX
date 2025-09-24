"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/http";

const schema = z
  .object({
    email: z.string().email("Informe um e-mail válido"),
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

  async function onSubmit(values: FormValues) {
    await api.post("/auth/register", {
      email: values.email,
      password: values.password,
    });
    router.push("/login");
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-4">
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-neutral-100">
        Criar conta
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
            autoComplete="new-password"
          />
          <FormField<FormValues>
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full">
            Registrar
          </Button>
          <p className="text-center text-xs text-neutral-400">
            Já tem conta?{" "}
            <Link href="/login" className="text-neutral-200 underline">
              Entrar
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}
