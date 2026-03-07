import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import type { Signature } from '@/types';
import { CLOUDINARY_CONFIG } from '@/utils/cloudinary';

export function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = new URLSearchParams({
    timestamp: timestamp.toString(),
    ...CLOUDINARY_CONFIG,
  });

  params.sort();

  // this is needed otherwise .toString() will escape symbols
  const serializedParams = decodeURIComponent(params.toString());

  const hash = createHash('sha1');

  const signature: Signature = {
    hash: hash
      .update(serializedParams + process.env.CLOUDINARY_SECRET)
      .digest('hex'),
    timestamp,
    expires: timestamp + 3600,
  };

  return NextResponse.json(signature);
}
