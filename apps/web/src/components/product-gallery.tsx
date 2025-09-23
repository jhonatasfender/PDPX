"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { cn } from "../lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

type Img = { id: string; url: string; alt?: string | null };

export function ProductGallery({ images }: { images: Img[] }) {
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const onSelect = useCallback(
    (api: EmblaCarouselType | undefined) => {
      if (!api) return;
      setSelected(api.selectedScrollSnap());

      thumbApi?.scrollTo(api.selectedScrollSnap());
    },
    [thumbApi],
  );

  useEffect(() => {
    if (!mainApi) return;
    const update = () => {
      onSelect(mainApi);
      setCanPrev(mainApi.canScrollPrev());
      setCanNext(mainApi.canScrollNext());
    };
    update();
    mainApi.on("select", update);
    mainApi.on("reInit", update);
  }, [mainApi, onSelect]);

  const scrollTo = (idx: number) => {
    mainApi?.scrollTo(idx);
  };

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800"
        ref={mainRef}
      >
        <div className="flex h-full">
          {images.map((img) => (
            <div key={img.id} className="min-w-0 flex-[0_0_100%] h-full">
              <div className="relative h-full w-full">
                <Image
                  src={img.url}
                  alt={img.alt ?? ""}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          aria-label="Imagem anterior"
          onClick={() => mainApi?.scrollPrev()}
          disabled={!canPrev}
          variant="secondary"
          size="sm"
          className={cn(
            "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 border border-neutral-700 bg-neutral-900/60 text-neutral-100 hover:bg-neutral-900 focus:ring-neutral-600",
          )}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          type="button"
          aria-label="Próxima imagem"
          onClick={() => mainApi?.scrollNext()}
          disabled={!canNext}
          variant="secondary"
          size="sm"
          className={cn(
            "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 border border-neutral-700 bg-neutral-900/60 text-neutral-100 hover:bg-neutral-900 focus:ring-neutral-600",
          )}
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <div className="mt-3 md:mt-4" ref={thumbRef}>
        <div className="flex gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => scrollTo(i)}
              className={cn(
                "relative aspect-square w-20 overflow-hidden rounded-md bg-neutral-800 ring-1 ring-transparent",
                i === selected && "ring-neutral-500",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
