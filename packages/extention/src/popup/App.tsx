import { lazy } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import GlobalLayout from "./app/layout";

const HomePage = lazy(() => import("./app/home"));
const SettingsPage = lazy(() => import("./app/settings"));

const router = createHashRouter([
	{
		path: "/",
		element: <GlobalLayout />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/settings", element: <SettingsPage /> },
		],
	},
]);

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

export default function App() {
	return <RouterProvider router={router} />;
}
