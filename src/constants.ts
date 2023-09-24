const ROUTES = ['Games', 'Platforms'] as const;

type Route = (typeof ROUTES)[number];

export const routes: Array<{ id: Route; href: string }> = [
  {
    id: 'Games',
    href: '/games',
  },
  {
    id: 'Platforms',
    href: '/platforms',
  },
];

export const COLOR_MODE_KEY = 'color-mode';
