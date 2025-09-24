import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import TextareaAutosize from "react-textarea-autosize";

type Props = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function Textarea({ className = "", ...props }: Props) {
  return (
    <TextareaAutosize
      minRows={3}
      className={cn(
        "w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700",
        className,
      )}
      {...(props as any)}
    />
  );
}
