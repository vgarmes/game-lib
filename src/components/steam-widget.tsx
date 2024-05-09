import { useEffect, useState } from 'react';
import { Spinner } from './common/LoadingScreen';
import Image from 'next/image';

type SteamGame = {
  appid: number;
  img_icon_url: string;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
};

type SteamResponse = {
  response: { games: Array<SteamGame>; total_count: number };
};

const getSteamGames = async () => {
  try {
    const response = await fetch('/api/steam/get-recently-played-games');
    return response.json() as Promise<SteamResponse>;
  } catch (error) {
    console.log(error);
  }
};

const constructUrl = (appid: string, hash: string) =>
  `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`;

const SteamWidget = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<SteamResponse>();
  useEffect(() => {
    const _games = getSteamGames().then((res) => {
      setGames(res);
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {loading && <Spinner />}
      <ul>
        {games?.response.games.map((game) => (
          <li key={game.appid} className="flex">
            <Image
              alt="game icon"
              width={32}
              height={32}
              src={constructUrl(game.appid.toString(), game.img_icon_url)}
            />

            {game.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SteamWidget;
