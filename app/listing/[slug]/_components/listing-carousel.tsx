"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyImages } from "@/lib/model/types";
import Image from "next/image";

interface ListingCarouselProps {
  propertyImages: PropertyImages[];
}

export function ListingCarousel({ propertyImages }: ListingCarouselProps) {
  return (
    <div className="mb-8">
      <Carousel className="mx-auto">
        <CarouselContent>
          {propertyImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  );
}
