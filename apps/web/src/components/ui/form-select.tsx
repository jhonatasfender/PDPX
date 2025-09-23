"use client";
import type { FieldValues, Path } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import type { ReactNode, SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options?: Option[];
  children?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  children,
  className = "",
  ...rest
}: Props<T>) {
  const { register } = useFormContext<T>();
  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-neutral-200">
          {label}
        </label>
      ) : null}
      <select
        {...register(name)}
        {...rest}
        className={`w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-neutral-700 ${className}`}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    </div>
  );
}
