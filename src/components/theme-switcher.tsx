"use client";

import { Laptop, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = {
  system: Laptop,
  light: Sun,
  dark: MoonStar,
};

export const ThemeSwitcher: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div
      role="radiogroup"
      className="flex w-fit items-center rounded-full border p-px"
    >
      {Object.entries(themes).map(([key, Icon]) => {
        const value = key as "system" | "light" | "dark";
        return (
          <button
            key={value}
            role="radio"
            aria-checked={mounted && theme === value}
            onClick={() => setTheme(value)}
            type="button"
            aria-label={`Switch to ${value} theme`}
            className="text-muted-foreground hover:text-foreground aria-checked:bg-background aria-checked:text-foreground flex size-6 items-center justify-center rounded-full aria-checked:border"
          >
            <Icon className="size-3" />
          </button>
        );
      })}
    </div>
  );
};
