import { COLOR_MODE_KEY } from '../constants';

export enum COLOR_MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

function setColorsByTheme() {
  const colorModeKey = '$COLOR_MODE_KEY';

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDarkFromMQ = mql.matches;
  const persistedPreference = localStorage.getItem(colorModeKey);

  let colorMode = 'light';

  const hasUsedToggle = typeof persistedPreference === 'string';

  if (hasUsedToggle) {
    colorMode = persistedPreference;
  } else {
    colorMode = prefersDarkFromMQ ? 'dark' : 'light';
  }

  document.body.className = colorMode;
}

const boundFn = String(setColorsByTheme).replace(
  '$COLOR_MODE_KEY',
  COLOR_MODE_KEY
);

export const colorModeScript = `(${boundFn})()`;
