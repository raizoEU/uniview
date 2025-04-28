"use client";

import { Calendar } from "@/components/calendar";
import { Popover, PopoverTrigger } from "@/components/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listings } from "@/lib/model/schema";
import { Listings, Universities } from "@/lib/model/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { createUpdateSchema } from "drizzle-zod";
import { BadgePoundSterling, Clock, Library, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DisplayInformation } from "../display-information";

export function UpdateListingDetails({
  listing,
  allUniversities,
  listingUniversity,
}: {
  listingUniversity: Universities;
  listing: Listings;
  allUniversities: Universities[];
}) {
  const [edit, setEdit] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between flex-wrap items-center">
          <CardTitle>Listing Details</CardTitle>
          <div className="flex gap-2">
            <DeleteListingDialog listingId={listing.id} />
            <Button
              className="h-full"
              variant="outline"
              onClick={() => setEdit(!edit)}
            >
              {edit ? "Cancel" : "Edit Details"}
            </Button>
          </div>
        </div>

        <CardDescription>
          View and edit your listing details here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {edit ? (
            <EditListingForm listing={listing} unis={allUniversities} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10 ">
              <DisplayInformation
                title="General"
                icon={<Library className="h-4 w-4" />}
              >
                <p>{listing.title}</p>
                <p>{listing.description}</p>
              </DisplayInformation>

              <DisplayInformation
                title="Dates"
                icon={<Clock className="h-4 w-4" />}
              >
                <p>
                  Available from{" "}
                  <span className="text-foreground">
                    {listing.availableFrom.toLocaleDateString()}
                  </span>
                </p>
                <p>
                  Listing created on{" "}
                  <span className="text-foreground">
                    {listing.createdAt?.toLocaleDateString()}
                  </span>
                </p>
              </DisplayInformation>

              <DisplayInformation
                title="Location"
                icon={<MapPin className="h-4 w-4" />}
              >
                <p>{listing.location}</p>
                <p>{listingUniversity.name ?? "No university selected"}</p>
              </DisplayInformation>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DeleteListingDialog({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    toast.loading("Deleting listing...");

    try {
      const res = await fetch(`/api/listings`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }

      toast.success("Listing deleted successfully");
      router.push("/host/dashboard/my-listings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete listing. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Listing</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.{" "}
            <strong>
              This will permanently delete your listing, and people who booked
              this listing will lose their booking.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Continue"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const editListingSchema = createUpdateSchema(listings, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  availableFrom: z.date().min(new Date(), "Available from date is required"),
  price: z.number().min(1, "Price is required"),
});

function EditListingForm({
  listing,
  unis,
}: {
  listing: Listings;
  unis: Universities[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof editListingSchema>>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      availableFrom: listing.availableFrom,
      price: Number(listing.price),
      location: listing.location,
      universityId: listing.universityId,
    },
  });

  const onSubmit = async (data: z.infer<typeof editListingSchema>) => {
    if (!form.formState.isDirty) {
      toast.error("No changes detected.");
      return;
    }
    toast.loading("Updating...");
    setIsLoading(true);
    try {
      const res = await fetch(`/api/listings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: listing.id }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      toast.success("Listing updated successfully");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("Unexpected error occurred. Please contact administrator.");
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  const onErrors = (errors: any) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className="w-full space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">
          <DisplayInformation
            title="General"
            icon={<Library className="h-4 w-4" />}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for your listing"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a description for your listing"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DisplayInformation>

          <DisplayInformation
            title="Dates"
            icon={<Clock className="h-4 w-4" />}
          >
            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available From</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        fromDate={new Date()}
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DisplayInformation>

          <DisplayInformation
            title="Location"
            icon={<MapPin className="h-4 w-4" />}
          >
            <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select
                    defaultValue={listing.universityId as string | undefined}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {unis.map((university) => (
                        <SelectItem key={university.id} value={university.id}>
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DisplayInformation>

          <DisplayInformation
            title="Price"
            icon={<BadgePoundSterling className="h-4 w-4" />}
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a price for your listing"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DisplayInformation>
        </div>

        <div className="flex w-full justify-end">
          <Button type="submit" className="w-fit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
