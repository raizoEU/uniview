"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/model/types";

export type ClientSideImage = {
  file: File;
  url: string;
};

interface AvatarUploaderProps {
  userImage: User["image"] | null;
  fallbackText: string;
  clientSideImage: ClientSideImage | null;
  handleClientSideImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export function AvatarUploader({
  userImage,
  fallbackText,
  clientSideImage,
  handleClientSideImageChange,
  loading,
}: AvatarUploaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {userImage ||
          (clientSideImage?.url && (
            <AvatarImage
              src={clientSideImage.url ?? userImage}
              alt={"Avatar of " + userImage}
            />
          ))}
        {!userImage && !clientSideImage?.url && (
          <AvatarFallback className="text-2xl">{fallbackText}</AvatarFallback>
        )}
      </Avatar>
      <Input
        type="file"
        disabled={loading}
        onChange={(e) => handleClientSideImageChange(e)}
      />
    </div>
  );
}
