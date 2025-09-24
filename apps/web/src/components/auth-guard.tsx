"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { AuthLoading } from "./auth-loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "USER" | "ADMIN";
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = "/login",
  fallback,
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      const currentPath = window.location.pathname;
      const redirectUrl = redirectTo === "/login" && currentPath !== "/login" 
        ? `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
        : redirectTo;
      router.push(redirectUrl);
      return;
    }

    if (!requireAuth && user) {
      const redirectParam = searchParams.get('redirect');
      router.push(redirectParam || "/");
      return;
    }

    if (requireAuth && user && requireRole && user.role !== requireRole) {
      router.push("/");
      return;
    }
  }, [user, isLoading, requireAuth, requireRole, redirectTo, router, searchParams]);

  if (isLoading) {
    return fallback || <AuthLoading />;
  }

  if (requireAuth && !user) {
    return fallback || null;
  }

  if (!requireAuth && user) {
    return fallback || null;
  }

  if (requireAuth && user && requireRole && user.role !== requireRole) {
    return fallback || null;
  }

  return <>{children}</>;
}
