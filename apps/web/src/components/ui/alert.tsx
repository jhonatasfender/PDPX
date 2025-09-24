import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface AlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  className?: string;
}

export function Alert({ children, variant = "info", className }: AlertProps) {
  const variants = {
    success: "border-green-800 bg-green-900/20 text-green-200",
    error: "border-red-800 bg-red-900/20 text-red-200",
    warning: "border-yellow-800 bg-yellow-900/20 text-yellow-200",
    info: "border-blue-800 bg-blue-900/20 text-blue-200",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
