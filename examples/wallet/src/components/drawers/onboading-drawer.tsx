import { FC } from "react";
import { DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";

const OnboardingDrawer: FC = () => {
	return (
		<>
			<DrawerHeader className="text-left">
				<DrawerTitle>Welcome to Demo Wallet</DrawerTitle>
				<DrawerDescription>
					This is a demo wallet for Webmax.js.{" "}
					<span className="text-destructive font-semibold">Never put assets in it. </span>
					There's also a DemoDapp that you can use.
				</DrawerDescription>
			</DrawerHeader>
		</>
	);
};

export default OnboardingDrawer;
