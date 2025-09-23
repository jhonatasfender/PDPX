"use client";
import type { FieldValues, Path } from "react-hook-form";
import { useFormContext } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export function FormCheckbox<T extends FieldValues>({ name, label }: Props<T>) {
  const { register } = useFormContext<T>();
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-300">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-neutral-100"
        {...register(name)}
      />
      <span>{label}</span>
    </label>
  );
}
