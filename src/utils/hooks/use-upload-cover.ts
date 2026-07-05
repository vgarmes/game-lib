import { trpc } from "@/trpc/client";
import { Signature } from "@/types";
import { CLOUDINARY_CONFIG, uploadImage } from "@/utils/cloudinary";

/**
 * Uploads an image file to Cloudinary and persists a matching cover record.
 * Returns the created cover id so it can be connected to a game.
 */
export function useUploadCover() {
  const createCover = trpc.cover.create.useMutation();

  return async (file: File): Promise<number> => {
    const signature: Signature = await fetch("/api/image/signature").then(
      (response) => response.json(),
    );

    const fd = new FormData();
    fd.append("file", file);
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

    return cover.id;
  };
}
