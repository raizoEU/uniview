"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSubmission } from "@/hooks/use-submission";
import { studentProfiles } from "@/lib/model/schema";
import { User } from "@/lib/model/types";
import {
  updateStudentProfileSchema,
  updateUserSchema,
} from "@/lib/validation/schemas";
import { generateReactHelpers } from "@uploadthing/react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./change-password-dialog";
import { useRef } from "react";

type StudentProfilesType = (typeof studentProfiles)["$inferSelect"];

const profileFormSchema = updateUserSchema.merge(updateStudentProfileSchema);

export function ProfileSettings({
  userData,
}: {
  userData: User & { studentProfiles: StudentProfilesType };
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Initialize form with user data
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      image: userData.image ?? "",
      biography: userData.studentProfiles.biography ?? "",
      phoneNumber: userData.studentProfiles.phoneNumber ?? "",
    },
  });

  const getBlobFile = async (blobUrl: string) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Extract MIME type from blob
      const mimeType = blob.type || "image/png"; // Fallback to 'image/png' if type is not available
      const fileExtension = mimeType.split("/")[1]; // Extract file extension from MIME type
      const fileName = `${crypto.randomUUID()}.${fileExtension}`; // Generate a unique file name with the correct extension

      // Create a File object
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error("Error fetching blob:", error);
    }
  };

  const { execute: onUpdateProfile, isLoading } = useSubmission({
    action: async (values: z.infer<typeof profileFormSchema>) => {
      if (form.formState.isDirty) {
        // Check if the image has been changed and upload it if it has.
        if (values.image) {
          const imageFile = await getBlobFile(values.image);
          if (imageFile) {
            await startUpload([imageFile]);
          }
        }

        // Get dirty values from the form and only pass those. Dirty values are the ones that have been changed.
        const dirtyValues = Object.keys(form.formState.dirtyFields).reduce(
          (acc, key) => ({
            ...acc,
            [key]: values[key as keyof typeof values],
          }),
          {}
        );

        const response = await fetch("/api/student", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userData.id, ...dirtyValues }),
        });

        if (!response.ok) {
          throw new Error("Failed to send request to server");
        }

        form.reset();
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    },
    loadingMessage: "Updating profile...",
    successMessage: "Profile updated successfully",
    errorMessage: "Failed to update profile",
  });

  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    onUploadBegin: () => {
      toast.loading("Uploading...");
    },
    onClientUploadComplete: async (res) => {
      toast.dismiss();
      toast.success("Images uploaded successfully");
      if (res?.[0]?.ufsUrl) {
        form.setValue("image", res[0].ufsUrl);
      }
    },
    onUploadError: (err) => {
      toast.dismiss();
      toast.error("Error uploading images");
      console.error(err);
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) =>
    onUpdateProfile({
      ...values,
    });

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the
                platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={form.getValues().image ?? (userData.image || "")}
                          alt={"Avatar of " + userData.name}
                        />
                        {!form.getValues().image && !userData.image && (
                          <AvatarFallback className="text-2xl">
                            {userData.name.charAt(0) ?? ""}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <FormField
                        control={form.control}
                        name="image"
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => {
                          return (
                            <FormItem>
                              <FormLabel>Picture</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    {...fieldProps}
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    disabled={isUploading}
                                    onChange={(event) => {
                                      if (!event.target?.files?.[0]) return;
                                      onChange(
                                        URL.createObjectURL(
                                          event.target?.files?.[0]
                                        )
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    type="button"
                                    disabled={!fileRef.current?.value}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      form.resetField("image");
                                      if (fileRef.current) {
                                        fileRef.current.value = "";
                                      }
                                    }}
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the email address you use to sign in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Used for booking confirmations and important
                              notifications.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="biography"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biography</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell hosts a bit about yourself"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This helps hosts get to know you better.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="submit"
                          disabled={isLoading || !form.formState.isDirty}
                          loading={isLoading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Account Type
                      </p>
                      <p className="capitalize">{userData.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </p>
                      <p>{userData.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="mt-4">
                    <ChangePasswordDialog />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
