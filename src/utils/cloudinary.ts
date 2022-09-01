import { createHash } from 'crypto';

export const CLOUDINARY_CONFIG = {
  folder: 'games',
};

export interface CloudinaryImage {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  url: string;
  secure_url: string;
}

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
