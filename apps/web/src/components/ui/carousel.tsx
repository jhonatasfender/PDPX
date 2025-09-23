"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "../../lib/cn";

export function Carousel({
  children,
  autoplay = false,
  slideClassName,
  className,
}: {
  children: ReactNode;
  autoplay?: boolean;
  slideClassName?: string;
  className?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    autoplay ? [Autoplay()] : [],
  );

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <div className={cn("overflow-hidden h-full", className)} ref={emblaRef}>
      <div className="flex h-full">
        {Array.isArray(children) ? (
          children.map((c, i) => (
            <div
              className={cn("min-w-0 flex-[0_0_100%] h-full", slideClassName)}
              key={i}
            >
              {c}
            </div>
          ))
        ) : (
          <div className={cn("min-w-0 flex-[0_0_100%] h-full", slideClassName)}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
