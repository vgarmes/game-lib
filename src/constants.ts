const ROUTES = {
  GAMES: 'Games',
  PLATFORMS: 'Platforms',
} as const;

type Route = keyof typeof ROUTES;

export const routes: Array<{ id: Route; href: string }> = [
  {
    id: 'GAMES',
    href: '/games',
  },
  {
    id: 'PLATFORMS',
    href: '/platforms',
  },
];
