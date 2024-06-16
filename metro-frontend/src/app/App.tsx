import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "src/app/appRoutes.tsx";
import "src/ui/styles/index.scss";

const router = createBrowserRouter(appRoutes);

export const App = () => {
    return <RouterProvider router={router} />;
};
