"use client";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { FormSelect } from "@/components/ui/form-select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";

export const productFormSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  brand: z.string().min(1, "Informe a marca"),
  sku: z.string().min(1, "Informe o SKU"),
  price: z.coerce.number().min(0, "Preço inválido"),
  stock: z.coerce.number().int().min(0, "Estoque inválido"),
  isActive: z.enum(["true", "false"]).default("true"),
  description: z.string().min(10, "Descrição muito curta"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function AdminProductForm({
  defaultValues,
  onSubmit,
  submitLabel = "Salvar",
}: {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit?: (values: ProductFormValues) => Promise<void> | void;
  submitLabel?: string;
}) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      brand: "",
      sku: "",
      price: 0,
      stock: 0,
      isActive: "true",
      description: "",
      ...(defaultValues ?? {}),
    },
  });

  return (
    <Form<ProductFormValues>
      methods={methods}
      onSubmit={async (v) => onSubmit?.(v)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField<ProductFormValues>
          name="name"
          label="Nome"
          placeholder="Sofá 3 lugares"
        />
        <FormField<ProductFormValues>
          name="brand"
          label="Marca"
          placeholder="Casa&Conforto"
        />
        <FormField<ProductFormValues>
          name="sku"
          label="SKU"
          placeholder="SOFA-3L-XYZ"
        />
        <FormField<ProductFormValues>
          name="price"
          label="Preço (R$)"
          type="number"
          placeholder="0,00"
          inputMode="decimal"
        />
        <FormField<ProductFormValues>
          name="stock"
          label="Estoque"
          type="number"
        />
        <FormSelect<ProductFormValues>
          name="isActive"
          label="Status"
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
        />
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-neutral-300">
            Descrição
          </label>
          <RichTextEditor
            value={methods.watch("description")}
            onChange={(html) => methods.setValue("description", html)}
            placeholder="Detalhes do produto"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </Form>
  );
}
