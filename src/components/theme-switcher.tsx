import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeCheckbox: React.FC<{
  theme: 'dark' | 'light';
  checked: boolean;
  onChange: () => void;
}> = ({ theme, checked, onChange }) => {
  return (
    <span className="h-full">
      <input
        id={`theme-switch-${theme}`}
        aria-label={theme}
        type="checkbox"
        value={theme}
        className="peer appearance-none p-0 m-0 outline-none absolute"
        checked={checked}
        onChange={onChange}
        disabled={checked}
      />
      <label
        htmlFor={`theme-switch-${theme}`}
        className={cn(
          'rounded-full flex items-center justify-center bg-none size-8 m-0 cursor-pointer absolute top-0 text-foreground [&_svg]:size-4 [&_svg]:relative [&_svg]:z-10 peer-checked:border peer-checked:border-border peer-checked:text-primary',
          { 'left-0': theme === 'light' },
          { 'right-0': theme === 'dark' },
          { 'bg-background': checked }
        )}
      >
        <span className="sr-only">{theme}</span>
        {theme === 'dark' ? <Moon /> : <Sun />}
      </label>
    </span>
  );
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <fieldset className="flex rounded-full h-8 w-16 m-0 p-0 border border-border">
        <ThemeCheckbox
          theme="light"
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
        />
        <ThemeCheckbox
          theme="dark"
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
        />
      </fieldset>
    </div>
  );
};

export default ThemeSwitcher;
