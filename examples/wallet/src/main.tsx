import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./app/404";
import GlobalLayout from "./app/layout";
import "./globals.css";

const HomePage = lazy(() => import("./app/home"));
const SettingsPage = lazy(() => import("./app/settings"));

const queryClient = new QueryClient({});

const router = createBrowserRouter([
	{
		path: "/",
		element: <GlobalLayout />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/settings", element: <SettingsPage /> },
		],
		errorElement: <NotFound />,
	},
]);

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>,
);
