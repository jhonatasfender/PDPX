"use client";
import { cn } from "@/lib/cn";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { locales } from "@blocknote/core";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({ value = "", onChange, placeholder, className = "" }: Props) {
  const editor = useCreateBlockNote({
    initialContent: value ? undefined : undefined,
    dictionary: locales.ptBR,
  });

  return (
    <div className={cn("rounded-md border border-neutral-800", className)}>
      <BlockNoteView
        editor={editor}
        theme="dark"
        onChange={() => onChange?.(editor.documentToHTML())}
        formattingToolbar={true}
        sideMenu={true}
        slashMenu={true}
        placeholder={placeholder ?? "Escreva a descrição..."}
      />
    </div>
  );
}


