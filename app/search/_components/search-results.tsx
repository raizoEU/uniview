"use client";

import { ListingCard } from "@/components/listing-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Listings } from "@/lib/model/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface SearchResponse extends Listings {
  imageUrl: string | undefined;
  universityName: string | undefined;
}

interface PaginatedResponse {
  items: SearchResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["search", searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <div className="mt-8">
        <p className="text-muted-foreground">No listings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.map((listing) => {
          const formattedProps = {
            ...listing,
            propertyImages: [
              {
                imageUrl: listing.imageUrl ?? "/placeholder.jpg",
              },
            ],
            university: {
              name: listing.universityName ?? null,
            },
          };
          return <ListingCard key={listing.id} listing={formattedProps} />;
        })}
      </div>

      <div className="flex justify-center w-full">
        <Pagination className="w-full">
          <PaginationContent className="flex-wrap">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (currentPage - 1).toString(),
                  })}`}
                />
              </PaginationItem>
            )}
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: page.toString(),
                    })}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            {currentPage < data.totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (currentPage + 1).toString(),
                  })}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
