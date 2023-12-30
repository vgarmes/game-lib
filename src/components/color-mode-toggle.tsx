import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  invertBackground?: boolean;
}
const ColorModeToggle: React.FC<Props> = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = mounted ? resolvedTheme : null;

  return (
    <button
      className="inline-flex items-center justify-center rounded-full bg-muted w-8 h-8"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <span className="relative h-5 w-5 overflow-hidden">
        <span
          className={clsx(
            'absolute inset-0 inline-flex items-center justify-center',
            {
              invisible: theme === 'dark',
            }
          )}
        >
          <Sun className="text-orange-500 w-full" />
        </span>
        <span
          className={clsx(
            'absolute inset-0 inline-flex items-center justify-center',
            {
              invisible: theme === 'light',
            }
          )}
        >
          <Moon className="text-yellow-300 w-full" />
        </span>
      </span>
    </button>
  );
};

export default ColorModeToggle;
