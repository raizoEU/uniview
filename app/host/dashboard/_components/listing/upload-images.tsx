"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyImages } from "@/lib/model/types";
import { cn } from "@/lib/utils";
import { generateReactHelpers, useDropzone } from "@uploadthing/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

export default function UploadImages({
  listingId,
  images,
  revalidatePathOnServer,
}: {
  listingId: string;
  images: PropertyImages[];
  revalidatePathOnServer: () => void;
}) {
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const router = useRouter();

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "imageUploader",
    {
      onUploadBegin: () => {
        toast.loading("Uploading...");
      },
      onClientUploadComplete: async () => {
        toast.dismiss();
        toast.success("Images uploaded successfully");
        revalidatePathOnServer();
        clearFiles();
      },
      onUploadError: (err) => {
        toast.dismiss();
        toast.error("Error uploading images");
        console.error(err);
      },
    }
  );

  const clearFiles = () => {
    setFiles([]);
  };

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: true,

    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const onUpload = async () => {
    console.log("Uploading files...");
    await startUpload(files, { listingId });
  };

  const imagesFromDb = images.map((image) => image.imageUrl);

  return (
    <div className="space-y-4">
      <div>
        {imagesFromDb.length > 0 ? (
          <ImageCarousel imagesFromDb={imagesFromDb} />
        ) : (
          <Card>No uploaded yet</Card>
        )}
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 py-8 flex flex-col space-y-3">
        {files.length > 0 && <ImagesPreview files={files} />}
        <div
          {...getRootProps()}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "border border-dashed border-muted rounded-md p-32",
            isDragAccept && "bg-secondary border border-primary",
            isDragReject && "bg-desctructive border border-destructive",
            isDragActive && "border border-accent"
          )}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <p className="text-muted-foreground">
              Drag and drop images here or click to upload
            </p>
          </div>
        </div>
        <div className={cn(files.length > 0 && "mt-4")}>
          {files.length > 0 && (
            <UploadImagesActions
              {...{ isUploading, onUpload, files, clearFiles }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ImageCarouselProps {
  imagesFromDb: string[];
}

export function ImageCarousel({ imagesFromDb }: ImageCarouselProps) {
  return (
    <Carousel className="mx-12">
      <CarouselContent className="-ml-1">
        {imagesFromDb.map((imageUrl, index) => (
          <CarouselItem
            key={imageUrl}
            className="pl-1 md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={imageUrl}
                    alt={`Shot of listing ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12" />
      <CarouselNext className="-right-12" />
    </Carousel>
  );
}

function ImagesPreview({ files }: { files: any }) {
  const images = files.map((file: File) => {
    return (
      <div
        key={file.name}
        className="flex items-center justify-center gap-2 relative flex-wrap"
      >
        <Link
          target="_blank"
          href={URL.createObjectURL(file)}
          className="group/image-preview"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="aspect-video h-32 brightness-80 group-hover/image-preview:brightness-125 transition-all ease-in-out duration-300"
          />
        </Link>
      </div>
    );
  });

  return <div className="flex items-center justify-start gap-2">{images}</div>;
}

function UploadImagesActions({
  isUploading,
  onUpload,
  files,
  clearFiles,
}: any) {
  return (
    <div className="flex gap-2 flex-wrap w-full items-center justify-end">
      <Button
        loading={isUploading}
        disabled={isUploading}
        variant="outline"
        className="h-full"
        onClick={() => clearFiles()}
      >
        Remove All Selected Files
      </Button>
      <Button
        loading={isUploading}
        disabled={isUploading}
        variant="default"
        className="h-full"
        onClick={() => onUpload()}
      >
        Upload {files.length} Files
      </Button>
    </div>
  );
}
