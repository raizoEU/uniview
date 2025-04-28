"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSubmission } from "@/hooks/use-submission";
import { createBookingSchema } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CheckoutFormProps {
  listingId: string;
  universityId?: string;
}

const createBookingSchemaClient = createBookingSchema.omit({ amount: true });

export function CheckoutForm({ listingId, universityId }: CheckoutFormProps) {
  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);
  const router = useRouter();

  const form = useForm<z.infer<typeof createBookingSchemaClient>>({
    resolver: zodResolver(createBookingSchemaClient),
    defaultValues: {
      startDate: startDate?.toISOString() ?? undefined,
      endDate: endDate?.toISOString() ?? undefined,
      paymentMethod: "card",
      listingId: listingId,
      universityId: universityId ?? "",
    },
  });

  const { execute, isLoading } = useSubmission({
    action: async (data: z.infer<typeof createBookingSchemaClient>) => {
      console.log("Submitting booking data:", data);
      const response = await fetch("/api/booking/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      router.push(`/bookings`);

      if (!response.ok) {
        console.error("Booking creation failed:", responseJson.message);
        throw new Error("Failed to create booking");
      }
    },
    loadingMessage: "Checking out...",
    successMessage: "Your booking has been placed.",
    errorMessage: "Failed to checkout",
  });
  const onSubmit = async (data: z.infer<typeof createBookingSchemaClient>) =>
    await execute(data);

  const onError = (error: any) => {
    console.error("An unexpected error occurred:", error);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="card" />
                          </FormControl>
                          <FormLabel className="font-normal">Card</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paypal" />
                          </FormControl>
                          <FormLabel className="font-normal">PayPal</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="bank-transfer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Bank Transfer
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || !form.formState.isDirty}
            >
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
