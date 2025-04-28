"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { studentstay_user } from "@/auth-schema";
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
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { User } from "@/lib/model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react";
import { createUpdateSchema } from "drizzle-zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type userModel = User;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UpdateUserDetails({
  user,
}: {
  user: Omit<userModel, "image"> & {
    image?: string | null;
  };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const baseSchema = createUpdateSchema(studentstay_user);
  const router = useRouter();

  const extendedSchema = baseSchema.merge(
    z.object({
      image: z
        .custom<FileList>((files) => files instanceof FileList, "Required")
        .optional()
        .refine(
          (files) =>
            !files || (files.length > 0 && files[0].size <= MAX_FILE_SIZE),
          "File size must be less than 4MB"
        )
        .refine(
          (files) =>
            !files ||
            (files.length > 0 && ACCEPTED_IMAGE_TYPES.includes(files[0].type)),
          "Only .jpg, .png, and .webp formats are supported"
        ),
    })
  );

  const form = useForm<z.infer<typeof extendedSchema>>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: "student",
      image: undefined,
    },
  });

  const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("avatarUploader", {
    onUploadBegin: () => {
      toast.loading("Uploading...");
    },
    onClientUploadComplete: async () => {
      toast.dismiss();
      toast.success("Images uploaded successfully");
    },
    onUploadError: (err) => {
      toast.dismiss();
      toast.error("Error uploading images");
      console.error(err);
    },
  });

  const onSubmit = async (data: z.infer<typeof extendedSchema>) => {
    toast.loading("Updating profile...");
    setIsLoading(true);

    /**  For better-auth, updating a user's details are handled specificly:
     1. Updating user fields that are common (whether you are using username/password or OAuth)
     2. Changing an email address
     3. Updating user fields that are specific to the auth provider (e.g. password for password auth, phone number for phone number auth)
     */
    try {
      // Build an object with only the updated fields
      const updatedFields: Partial<typeof data> = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === "image") {
            return value instanceof FileList && value.length > 0;
          }
          return value !== user[key as keyof typeof user];
        })
      );

      // Initialize the authClientFields object
      let authClientFields: { image?: string; name?: string } = {};

      // Handle image upload if it was updated
      if (updatedFields.image && updatedFields.image.length > 0) {
        await startUpload(Array.from(updatedFields.image));
      }

      // Add name to authClientFields if it was updated
      if (updatedFields.name) {
        authClientFields.name = updatedFields.name;
      }

      // Check if any fields need to be updated in the auth client
      if (Object.keys(authClientFields).length > 0) {
        const { image, ...updatedFields } = authClientFields;
        await authClient.updateUser(updatedFields); // Update the user with the fields that have changed
      }

      toast.success("Profile updated successfully!");
      form.reset();
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("Unexpected error occurred. Please contact administrator.");
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  const onError = (error: any) => {
    console.error("An unexpected error occurred:", error);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormField
          control={form.control}
          disabled={isLoading}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={isLoading}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="picture">Profile Picture</Label>
              <FormControl>
                <Input
                  id="picture"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => field.onChange(e.target.files)}
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
