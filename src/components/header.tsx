import ColorModeToggle from './color-mode-toggle';
import UserMenu from './user-menu';

export const Header = () => {
  return (
    <header className="flex shrink-0 items-center w-full top-0 sticky bg-card z-10 pt-4 sm:pt-2 pb-4">
      <div className="ml-auto flex items-center space-x-4">
        <ColorModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
