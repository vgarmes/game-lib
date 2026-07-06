import { createHmac, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE = 'session';

// 30 days
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not set');
  }
  return secret;
};

const base64url = (input: string) =>
  Buffer.from(input).toString('base64url');

const sign = (payload: string) =>
  createHmac('sha256', getSecret()).update(payload).digest('base64url');

const encoder = new TextEncoder();

const safeEqual = (a: string, b: string) => {
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
};

/** Constant-time comparison of a candidate password against APP_PASSWORD. */
export const checkPassword = (candidate: string) => {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    throw new Error('APP_PASSWORD is not set');
  }
  return safeEqual(candidate, expected);
};

/** Creates a signed, self-verifying session token (no DB needed). */
export const createSessionToken = () => {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = base64url(JSON.stringify({ exp }));
  return `${payload}.${sign(payload)}`;
};

/** Verifies a session token's signature and expiry. */
export const verifySessionToken = (token: string | undefined | null) => {
  if (!token) {
    return false;
  }
  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return false;
  }
  if (!safeEqual(signature, sign(payload))) {
    return false;
  }
  try {
    const { exp } = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    ) as { exp: number };
    return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
