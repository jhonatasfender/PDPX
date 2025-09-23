"use client";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

type SwatchOption = {
  value: string;
  label: string;
  color: string;
};

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  options: SwatchOption[];
  defaultValue?: string;
};

export function RadioSwatch({ name, options, defaultValue, ...rest }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="inline-flex">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={
              defaultValue ? defaultValue === opt.value : undefined
            }
            className="peer sr-only"
            {...rest}
          />
          <span
            title={opt.label}
            aria-label={opt.label}
            className="h-8 w-8 rounded-full ring-2 ring-neutral-700 transition peer-checked:ring-neutral-400 peer-focus-visible:outline-2 peer-focus-visible:outline-neutral-500"
            style={{ backgroundColor: opt.color }}
          />
        </label>
      ))}
    </div>
  );
}
