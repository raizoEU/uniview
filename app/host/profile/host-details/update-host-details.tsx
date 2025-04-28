"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSubmission } from "@/hooks/use-submission";
import { hostProfiles } from "@/lib/model/schema";
import { HostProfiles } from "@/lib/model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUpdateSchema } from "drizzle-zod";
import parsePhoneNumber from "libphonenumber-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

type hostModel = HostProfiles;

export function UpdatehostDetails({ host }: { host: hostModel }) {
  // Define zod schema for updating host profile
  const updateSchema = createUpdateSchema(hostProfiles, {
    businessName: z.string().min(1, "Business name is required"),
    biography: z.string().min(1, "Biography is required"),
    phoneNumber: z.string().transform((value, ctx) => {
      const phoneNumber = parsePhoneNumber(value, {
        defaultCountry: "GB",
      });

      if (!phoneNumber?.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number",
        });
        return z.NEVER;
      }

      return phoneNumber.formatInternational();
    }),
  });

  // Use useSubmission hook to handle loading state, error handling, and notifications
  const { execute, isLoading } = useSubmission({
    action: async (data: z.infer<typeof updateSchema>) =>
      fetch("/api/hostProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id: host.id }),
      }),
    successMessage: "Successfully updated host profile",
    errorMessage: "Failed to update host profile",
    onSuccess: () => console.log("Profile updated!"),
  });

  // Define onSubmit function to handle form submission
  const onSubmit = (data: z.infer<typeof updateSchema>) =>
    execute({ ...data, id: host.id });

  // Define onError function to handle form errors
  const onError = (error: any) => {
    console.error("An unexpected error occurred:", error);
  };

  // react-hook-form hook to handle form state
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      businessName: host.businessName ?? "",
      biography: host.biography ?? "",
      phoneNumber: host.phoneNumber ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormField
          control={form.control}
          disabled={isLoading}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your business name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={isLoading}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your biography"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isLoading}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
