import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700",
        className,
      )}
      {...props}
    />
  );
}
