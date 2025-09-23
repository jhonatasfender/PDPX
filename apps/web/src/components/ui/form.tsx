"use client";
import {
  type FieldValues,
  type DefaultValues,
  FormProvider,
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import type { ReactNode } from "react";

type Props<T extends FieldValues> = {
  children: ReactNode;
  methods?: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
};

export function Form<T extends FieldValues>({
  children,
  methods,
  onSubmit,
  defaultValues,
}: Props<T>) {
  const internal = useForm<T>({ defaultValues });
  const m = methods ?? internal;
  return (
    <FormProvider<T> {...m}>
      <form onSubmit={onSubmit ? m.handleSubmit(onSubmit) : undefined}>
        {children}
      </form>
    </FormProvider>
  );
}
