"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubmission } from "@/hooks/use-submission";
import { Listings } from "@/lib/model/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, Heart, MapPin, Share, Verified } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ListingHeaderProps {
  listing: Listings;
  isASavedListing: boolean | undefined;
  handleSaveToFavourites: () => Promise<void>;
}

export function ListingHeader({
  listing,
  isASavedListing,
  handleSaveToFavourites,
}: ListingHeaderProps) {
  const router = useRouter();

  const { isLoading: isSaveLoading, execute: handleSave } = useSubmission({
    action: async () => {
      await handleSaveToFavourites();
    },
    successMessage: isASavedListing
      ? "Listing removed successfully"
      : "Listing saved successfully",
    errorMessage: isASavedListing
      ? "Failed to remove listing"
      : "Failed to save listing",
  });

  return (
    <div className="mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors ease-in-out duration-250"
      >
        <ChevronLeft className="h-4 w-4 mr-3 mt-[2px]" />
        Back to previous page
      </button>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{listing.location}</span>
            {listing.isVerified && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200"
              >
                <Verified className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSave}
            className={cn(isASavedListing && "text-red-500 hover:text-red-600")}
            loading={isSaveLoading}
          >
            <Heart
              className={cn("h-5 w-5", isASavedListing && "fill-current")}
            />
            <span className="sr-only">Save to favorites</span>
          </Button>
          <ShareDropdown />
        </div>
      </div>
    </div>
  );
}

function ShareDropdown() {
  const handleShareDropdownItemClick = () => {
    const textToCopy = window.location.href;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Link copied to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit mt-2" align="end">
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShareDropdownItemClick}>
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
