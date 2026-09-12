import { createMemoryRouter } from "react-router";

//
//

export const router = createMemoryRouter([
  { path: "/", element: <span>Home</span> },
  { path: "/settings", element: <span>Settings</span> },
]);
