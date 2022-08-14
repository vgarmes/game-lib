import { createHash } from 'crypto';

export const CLOUDINARY_CONFIG = {
  eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
  folder: 'test',
};

function generateSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const params = new URLSearchParams({
    timestamp,
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
    timestamp: timestamp.toString(),
  };
}

export default generateSignature;
