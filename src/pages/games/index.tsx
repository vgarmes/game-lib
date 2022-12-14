import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/common';
import { getButtonClassnames } from '../../components/common/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import SearchInput from '../../components/common/SearchInput';
import GameList from '../../components/GameList';
import Icon from '../../components/icon';
import useDebounce from '../../utils/hooks/useDebounce';
import { inferQueryOutput, trpc } from '../../utils/trpc';

const size = 20;
const page = 0;

const GameResults = ({ query }: { query: string }) => {
  const { data: games, isLoading } = trpc.useQuery(
    ['game.search', { skip: size * page, query }],
    { staleTime: 5000 }
  );

  if (isLoading || !games) {
    return <LoadingScreen />;
  }
  return <GameList games={games} />;
};

const GamePage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000);
  return (
    <div>
      <div className="flex w-full items-center justify-between gap-3 pb-6">
        <div className="max-w-lg grow">
          <SearchInput
            placeholder="Search games"
            value={query}
            onChange={(value) => setQuery(value)}
          />
        </div>
        {session && (
          <Link href="/games/new" passHref>
            <a className={getButtonClassnames('primary', 'solid')}>
              <Icon name="plus" />
              <span className="hidden md:inline-block">Add game</span>
            </a>
          </Link>
        )}
      </div>
      <GameResults query={debouncedQuery} />
    </div>
  );
};

export default GamePage;
