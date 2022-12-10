import { useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import SearchInput from '../../components/common/SearchInput';
import GameList from '../../components/GameList';
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
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000);
  return (
    <div>
      <form className="pb-12" onSubmit={(e) => e.preventDefault()}>
        <SearchInput
          placeholder="Search games"
          value={query}
          onChange={(value) => setQuery(value)}
        />
      </form>
      <GameResults query={debouncedQuery} />
    </div>
  );
};

export default GamePage;
