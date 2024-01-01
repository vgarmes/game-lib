import { useSearch } from '@/utils/search';
import { Input } from './ui/input';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const { inputValue, onChangeInputValue } = useSearch();
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
      <Input
        type="search"
        placeholder="Search games..."
        className="pl-9"
        value={inputValue}
        onChange={(e) => onChangeInputValue(e.target.value)}
      />
    </div>
  );
};

export default Search;
