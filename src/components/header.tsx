import ColorModeToggle from './color-mode-toggle';
import Search from './search';
import UserMenu from './user-menu';

interface Props {
  withSearch?: boolean;
}
export const Header: React.FC<Props> = ({ withSearch }) => {
  return (
    <header className="sticky left-0 top-0 w-full z-10 bg-background">
      <div className="flex gap-4 items-center flex-auto px-4 py-2 border-b min-h-[56px]">
        {withSearch && (
          <div className="grow max-w-lg">
            <Search />
          </div>
        )}
        <div className="flex items-center gap-4 flex-auto justify-end">
          <ColorModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
