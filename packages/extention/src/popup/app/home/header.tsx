import { Button } from "@/components/ui/button";

export const HomeHeader = () => {
	return (
		<header className="border-b p-4 flex justify-between items-center">
			<h1 className="text-lg font-semibold">Webmax</h1>
			<Button size="sm">Settings</Button>
		</header>
	);
};
