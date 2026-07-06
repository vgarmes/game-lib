import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { Signature } from '@/types';
import { CLOUDINARY_CONFIG } from '@/utils/cloudinary';
import { SESSION_COOKIE, verifySessionToken } from '@/server/session';

export async function GET() {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return new NextResponse('Not authorized', { status: 401 });
  }

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
