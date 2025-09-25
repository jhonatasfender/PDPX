"use client";

import { useEffect, useRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/cn";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (!isLoading) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: "border-red-800 bg-red-950/95",
    warning: "border-yellow-800 bg-yellow-950/95",
    info: "border-blue-800 bg-blue-950/95",
  };

  const confirmButtonVariant = variant === "danger" ? "danger" : "primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-cy="confirmation-modal">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-md rounded-lg border p-6 shadow-lg",
          variantStyles[variant],
        )}
      >
        <h3 className="mb-4 text-lg font-semibold text-white" data-cy="confirmation-modal-title">{title}</h3>
        <p className="mb-6 text-neutral-100" data-cy="confirmation-modal-message">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            data-cy="confirmation-modal-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            data-cy="confirmation-modal-confirm"
          >
            {isLoading ? "Processando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
