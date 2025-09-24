import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-300",
        secondary:
          "border border-neutral-800 bg-transparent text-neutral-100 hover:bg-neutral-900/60 focus:ring-neutral-800",
        ghost: "text-neutral-100 hover:bg-neutral-900/50",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-600",
        chip: "border border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-900/60 focus:ring-neutral-800 rounded-md",
      },
      size: {
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
        lg: "px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({
  children,
  className = "",
  variant,
  size,
  ...props
}: Props) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
