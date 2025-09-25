"use client";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { FormField } from "./ui/form-field";
import { FormCheckbox } from "./ui/form-checkbox";
import { FormSelect } from "./ui/form-select";

type Filters = {
  priceMin?: number;
  priceMax?: number;
  categories: Record<string, boolean>;
  brands: Record<string, boolean>;
  sort?: string;
};

type CatalogFiltersProps = {
  brands: string[];
  price: { minCents: number; maxCents: number };
};

export default function CatalogFilters({ brands, price }: CatalogFiltersProps) {
  const methods = useForm<Filters>({
    defaultValues: { categories: {}, brands: {}, sort: "relevance" },
  });

  return (
    <aside className="space-y-6 rounded-lg border border-neutral-800 p-4 md:space-y-7 md:p-5">
      <Form<Filters> methods={methods}>
        <div className="space-y-5 md:space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-200">
              Categorias
            </h3>
            <div className="space-y-2.5">
              <FormCheckbox<Filters> name="categories.sofas" label="Sofás" />
              <FormCheckbox<Filters>
                name="categories.poltronas"
                label="Poltronas"
              />
              <FormCheckbox<Filters> name="categories.mesas" label="Mesas" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-200">Preço</h3>
            <div className="flex items-center gap-3 md:gap-4">
              <FormField<Filters>
                name="priceMin"
                label=" "
                placeholder={
                  price?.minCents
                    ? String(Math.floor(price.minCents / 100))
                    : "Mín."
                }
                type="number"
              />
              <span className="text-neutral-500">—</span>
              <FormField<Filters>
                name="priceMax"
                label=" "
                placeholder={
                  price?.maxCents
                    ? String(Math.ceil(price.maxCents / 100))
                    : "Máx."
                }
                type="number"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-200">Marca</h3>
            <div className="space-y-2.5">
              {brands.map((b) => (
                <FormCheckbox<Filters>
                  key={b}
                  name={
                    `brands.${b.toLowerCase().replace(/\s+/g, "")}` as const
                  }
                  label={b}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-200">
              Ordenar
            </h3>
            <FormSelect<Filters>
              name="sort"
              options={[
                { value: "relevance", label: "Relevância" },
                { value: "price-asc", label: "Preço: menor para maior" },
                { value: "price-desc", label: "Preço: maior para menor" },
              ]}
            />
          </div>
        </div>
      </Form>
    </aside>
  );
}
