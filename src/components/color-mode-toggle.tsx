import { useTheme } from 'next-themes';
import Icon from './icon';
import { useEffect, useState } from 'react';

interface Props {
  invertBackground?: boolean;
}
const ColorModeToggle: React.FC<Props> = ({ invertBackground = false }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = mounted ? resolvedTheme : null;

  return (
    <button
      className="relative inline-flex items-center justify-between gap-4 rounded-full bg-muted p-2 transition-colors"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon
        name="sun"
        className={theme === 'light' ? 'text-orange-500' : 'text-inherit'}
      />
      <Icon
        name="moon"
        className={theme === 'dark' ? 'text-yellow-300' : 'text-inherit'}
      />
    </button>
  );
};

export default ColorModeToggle;
