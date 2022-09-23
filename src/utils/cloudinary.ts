import { CloudinaryUploadResponse } from '../types/cloudinary';

export const CLOUDINARY_CONFIG = {
  folder: process.env.NODE_ENV === 'development' ? 'dev' : 'games',
};

export async function uploadImage(
  body: FormData
): Promise<CloudinaryUploadResponse | undefined> {
  const response = await fetch(
    'https://api.cloudinary.com/v1_1/' +
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! +
      '/image/upload',
    { method: 'POST', body }
  );
  return response.json();
}
