import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '../../../server/common/get-server-session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).end('Not authorized');
  }
  const { method } = req;
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).send(`Method ${method} Not Allowed`);
  }
  const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    res.status(500).send('Something went wrong with Steam API');
  }
  const games = await response.json();
  res.status(200).json(games);
}
