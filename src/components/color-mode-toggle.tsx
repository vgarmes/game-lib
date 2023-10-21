import { useTheme } from 'next-themes';
import Icon from './icon';
import { useEffect, useState } from 'react';

interface Props {
  invertBackground?: boolean;
}
const ColorModeToggle: React.FC<Props> = ({ invertBackground = false }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const colorTheme = mounted ? theme : null;

  return (
    <button
      className="relative inline-flex items-center justify-between gap-4 rounded-full bg-muted p-2 transition-colors"
      onClick={() => setTheme(colorTheme === 'dark' ? 'light' : 'dark')}
    >
      <Icon
        name="sun"
        className={colorTheme === 'light' ? 'text-orange-500' : 'text-inherit'}
      />
      <Icon
        name="moon"
        className={colorTheme === 'dark' ? 'text-yellow-300' : 'text-inherit'}
      />
    </button>
  );
};

export default ColorModeToggle;
