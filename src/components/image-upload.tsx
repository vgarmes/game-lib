/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { CLOUDINARY_CONFIG, uploadImage } from "../utils/cloudinary";
import { Signature } from "../types";
import { trpc } from "@/trpc/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  CheckCircle2,
  ImagePlus,
  Upload,
  CircleCheck,
  Loader2,
  Image,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";

interface Props {
  src?: string;
  isUploaded: boolean;
  onRemove: () => void;
  onClick: () => void;
}
const PreviewImage: React.FC<Props> = ({ src, isUploaded, onClick }) => {
  if (!src) {
    return (
      <div className="bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-md border shadow-xs shadow-black/10">
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={onClick}
        >
          <Image className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-md border shadow-xs shadow-black/10">
      <img
        src={src}
        alt="Cover preview"
        className="size-full object-cover"
        onLoad={() => URL.revokeObjectURL(src)}
      />
      <button
        type="button"
        className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
        onClick={onClick}
      >
        <Image className="size-4" />
      </button>
      <input
        accept="image/*"
        aria-label="Upload profile picture"
        className="sr-only"
        type="file"
      />
    </div>
  );
};

export function ImageField({
  defaultImageSrc,
  file,
  onFileChange,
}: {
  defaultImageSrc?: string;
  file?: File;
  onFileChange: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultImageSrc);

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center pt-5">
      <PreviewImage
        src={preview}
        isUploaded={false}
        onRemove={() => null}
        onClick={handlePlaceholderClick}
      />
      <Input
        ref={fileInputRef}
        id="coverImage"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

const ImageUpload: React.FC<{
  onSubmit?: (coverId: number) => void;
  defaultImageSrc?: string;
}> = ({ onSubmit, defaultImageSrc }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultImageSrc);
  const [imageFile, setImageFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const createCover = trpc.cover.create.useMutation({
    onError: (error) =>
      toast.error("Ups! Something went wrong.", {
        description: `${error?.toString().substring(0, 200) ?? "Try again"}`,
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setIsUploaded(false);
    }
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setIsLoading(true);

    try {
      const signature: Signature = await fetch("/api/image/signature").then(
        (response) => response.json(),
      );

      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      fd.append("timestamp", signature.timestamp.toString());
      fd.append("signature", signature.hash);
      fd.append("folder", CLOUDINARY_CONFIG.folder);

      const image = await uploadImage(fd);

      if (!image) {
        throw new Error("Image upload failed");
      }

      const {
        public_id: publicId,
        secure_url: secureUrl,
        original_filename: filename,
        format,
        bytes: byteSize,
        width,
        height,
        etag: checksum,
      } = image;

      const cover = await createCover.mutateAsync({
        publicId,
        secureUrl,
        filename,
        format,
        byteSize,
        width,
        height,
        checksum,
      });

      setIsUploaded(true);
      onSubmit?.(cover.id);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center pt-5">
        <PreviewImage
          src={preview}
          isUploaded={false}
          onRemove={() => null}
          onClick={handlePlaceholderClick}
        />
        <Input
          ref={fileInputRef}
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || isUploaded || !imageFile}
        className="mx-auto w-auto lg:w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isUploaded ? (
          <CircleCheck className="mr-2 h-4 w-4" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploaded ? "Uploaded" : "Upload"}
      </Button>
    </>
  );
};

export default ImageUpload;
