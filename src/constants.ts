const ROUTES = ["Home", "Search", "Platforms"] as const;

type Route = (typeof ROUTES)[number];

export const routes: Record<Route, string> = {
  Home: "/",
  Search: "/search",
  Platforms: "/platforms",
};

export const GAME_STATUSES = ["completed", "in_progress", "backlog"] as const;

export const STATUS_LABELS: Record<(typeof GAME_STATUSES)[number], string> = {
  completed: "Completed",
  in_progress: "In progress",
  backlog: "Backlog",
};
