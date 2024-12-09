const ROUTES = ['Home', 'Search', 'Platforms'] as const;

type Route = (typeof ROUTES)[number];

export const routes: Record<Route, string> = {
  Home: '/',
  Search: '/search',
  Platforms: '/platforms',
};
