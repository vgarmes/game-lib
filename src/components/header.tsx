import ColorModeToggle from './color-mode-toggle';
import Search from './search';
import UserMenu from './user-menu';

interface Props {
  withSearch?: boolean;
}
export const Header: React.FC<Props> = ({ withSearch }) => {
  return (
    <header className="flex shrink-0 items-center justify-between w-full top-0 sticky bg-card z-10 pt-4 sm:pt-2 pb-4 gap-4">
      {withSearch && (
        <div className="grow max-w-lg">
          <Search />
        </div>
      )}
      <div className="ml-auto flex items-center space-x-4">
        <ColorModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
