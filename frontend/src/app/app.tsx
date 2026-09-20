import { RouterProvider } from "react-router";

import { dragRegion } from "./app.classes";
import { router } from "./routes";

//
//

export default function App() {
  return (
    <>
      <div className={dragRegion()} aria-hidden="true" />
      <RouterProvider router={router} />
    </>
  );
}
