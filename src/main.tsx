import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error";
import AuthGuard from "./routes/auth-guard";
import ContextProviders from "./routes/context-providers";
import Root from "./routes/root";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Opponents from "./routes/opponents";
import Games from "./routes/games";
import Game from "./routes/game";
//import NotFoundPage from "./routes/not-found";
import Callback from "./routes/callback";
import Layout from "./routes/layout";
import Content from "./routes/content";
// import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            element: <Content />,
            children: [
              {
                index: true,
                element: <Home />,
              },
              {
                element: <AuthGuard />,
                children: [
                  {
                    element: <ContextProviders />,
                    children: [
                      {
                        path: "profile",
                        element: <Profile />,
                      },
                      {
                        path: "games",
                        element: <Games />,
                      },
                      {
                        path: "opponents",
                        element: <Opponents />,
                      },
                      {
                        path: "game/:id",
                        element: <Game />,
                      },
                    ],
                  },
                ],
              },
              // {
              //   path: "*",
              //   element: <NotFoundPage />,
              // },
            ],
          },
        ],
      },
      {
        path: "callback",
        element: <Callback />,
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
