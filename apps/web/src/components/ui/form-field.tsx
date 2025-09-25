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
  step?: number | string;
  disabled?: boolean;
  "data-cy"?: string;
};

export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  step,
  disabled,
  "data-cy": dataCy,
}: BaseProps & { name: Path<T> }) {
  const { register, formState } = useFormContext<T>();
  const fieldErrors = formState.errors as Record<string, { message?: string }>;
  const error = fieldErrors[name as string]?.message;

  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-300">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        step={step}
        disabled={disabled}
        data-cy={dataCy}
        {...register(name)}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
