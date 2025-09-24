import type { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Table({
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table
        className={cn("min-w-full text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function THead({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-neutral-800 bg-neutral-950/60 text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />;
}

export function TR({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-neutral-900/60", className)}
      {...props}
    />
  );
}

export function TH({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-medium", className)} {...props} />;
}

export function TD({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3", className)} {...props} />;
}
