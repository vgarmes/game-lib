import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/server/session';

export async function GET() {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return new NextResponse('Not authorized', { status: 401 });
  }

  const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    return new NextResponse('Something went wrong with Steam API', {
      status: 500,
    });
  }

  const games = await response.json();
  return NextResponse.json(games);
}
