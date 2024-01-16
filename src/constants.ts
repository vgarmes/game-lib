const ROUTES = ['Home', 'Search', 'Library'] as const;

type Route = (typeof ROUTES)[number];

export const routes: Record<Route, string> = {
  Home: '/',
  Search: '/search',
  Library: '/library',
};
