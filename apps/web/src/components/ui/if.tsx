import type { ReactNode } from "react";

export function If({
  condition,
  children,
  render,
}: {
  condition: boolean;
  children?: ReactNode;
  render?: () => ReactNode;
}) {
  if (!condition) return null;
  return <>{render ? render() : children}</>;
}
