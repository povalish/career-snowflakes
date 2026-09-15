export const ROUTES = {
  main: "/",
  settings: "/settings",
} as const satisfies Record<string, `/${string}`>;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
