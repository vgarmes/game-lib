import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  sessionCookieOptions,
} from '@/server/session';

export async function POST(req: Request) {
  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }

  if (typeof password !== 'string' || !checkPassword(password)) {
    return new NextResponse('Invalid credentials', { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);

  return NextResponse.json({ success: true });
}
