import { createHash } from 'crypto';
import { CloudinaryUploadResponse } from '../types/cloudinary';

export const CLOUDINARY_CONFIG = {
  folder: 'games',
};

export function generateSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = new URLSearchParams({
    timestamp: timestamp.toString(),
    ...CLOUDINARY_CONFIG,
  });

  params.sort();

  // this is needed otherwise .toString() will escape symbols
  const serializedParams = decodeURIComponent(params.toString());

  const hash = createHash('sha1');

  return {
    hash: hash
      .update(serializedParams + process.env.CLOUDINARY_SECRET)
      .digest('hex'),
    timestamp,
    expires: timestamp + 3600,
  };
}

export async function uploadImage(
  body: FormData
): Promise<CloudinaryUploadResponse | undefined> {
  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/' +
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! +
        '/image/upload',
      { method: 'POST', body }
    );
    return response.json();
  } catch (error) {
    console.log(error);
    return;
  }
}
