"use client";
import { z } from "zod";
import { useForm, type Resolver, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { FormSelect } from "@/components/ui/form-select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useCreateProduct } from "@/hooks/use-create-product";

export const productFormSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  brand: z.string().min(1, "Informe a marca"),
  sku: z.string().min(1, "Informe o SKU"),
  price: z.coerce.number().min(0, "Preço inválido"),
  stock: z.coerce.number().int().min(0, "Estoque inválido"),
  isActive: z.enum(["true", "false"]).default("true"),
  description: z.string().min(10, "Descrição muito curta"),
  images: z
    .array(
      z.object({
        url: z.string().url("URL inválida"),
        alt: z.string().optional().nullable(),
        isPrimary: z.boolean().default(false),
        position: z.coerce.number().int().min(0).default(0),
      }),
    )
    .optional(),
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

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "images" as any,
  });

  const { createProduct, isCreating } = useCreateProduct();

  return (
    <Form<ProductFormValues>
      methods={methods}
      onSubmit={async (v) => {
        if (onSubmit) await onSubmit(v);
        else await createProduct(v);
      }}
    >
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        data-cy="admin-product-form"
      >
        <FormField<ProductFormValues>
          name="name"
          label="Nome"
          placeholder="Sofá 3 lugares"
          data-cy="product-name"
        />
        <FormField<ProductFormValues>
          name="brand"
          label="Marca"
          placeholder="Casa&Conforto"
          data-cy="product-brand"
        />
        <FormField<ProductFormValues>
          name="sku"
          label="SKU"
          placeholder="SOFA-3L-XYZ"
          data-cy="product-sku"
        />
        <FormField<ProductFormValues>
          name="price"
          label="Preço (R$)"
          type="number"
          placeholder="0,00"
          inputMode="decimal"
          step="0.01"
          data-cy="product-price"
        />
        <FormField<ProductFormValues>
          name="stock"
          label="Estoque"
          type="number"
          data-cy="product-stock"
        />
        <FormSelect<ProductFormValues>
          name="isActive"
          label="Status"
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
          data-cy="product-status"
        />
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-neutral-300">
            Descrição
          </label>
          <div data-cy="product-description">
            <RichTextEditor
              value={methods.watch("description")}
              onChange={(html) => methods.setValue("description", html)}
              placeholder="Detalhes do produto"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-neutral-300">Imagens</label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              data-cy="product-image-add"
              onClick={() =>
                append({
                  url: "",
                  alt: "",
                  isPrimary: false,
                  position: fields.length,
                })
              }
            >
              Adicionar imagem
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((f, idx) => (
              <div
                key={f.id}
                className="grid grid-cols-1 gap-3 md:grid-cols-6 border border-neutral-800 rounded-md p-3"
                data-cy={`product-image-${idx}`}
              >
                <div className="md:col-span-3">
                  <FormField<ProductFormValues>
                    name={`images.${idx}.url` as any}
                    label="URL"
                    placeholder="https://..."
                    data-cy={`product-image-${idx}-url`}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField<ProductFormValues>
                    name={`images.${idx}.alt` as any}
                    label="Alt"
                    placeholder="Texto alternativo"
                    data-cy={`product-image-${idx}-alt`}
                  />
                </div>
                <div className="md:col-span-1">
                  <FormField<ProductFormValues>
                    name={`images.${idx}.position` as any}
                    label="Posição"
                    type="number"
                    data-cy={`product-image-${idx}-position`}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      {...methods.register(`images.${idx}.isPrimary` as any)}
                      data-cy={`product-image-${idx}-primary`}
                    />
                    Principal
                  </label>
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(idx)}
                    data-cy={`product-image-${idx}-remove`}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="submit" data-cy="product-submit" disabled={isCreating}>
          {isCreating ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </Form>
  );
}
