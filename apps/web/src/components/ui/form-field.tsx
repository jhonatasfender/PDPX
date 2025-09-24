"use client";
import type { FieldValues, Path } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "./input";

type BaseProps = {
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
}: BaseProps & { name: Path<T> }) {
  const { register, formState } = useFormContext<T>();
  const error = (formState.errors as any)?.[name]?.message as
    | string
    | undefined;

  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-300">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode as any}
        {...register(name)}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
