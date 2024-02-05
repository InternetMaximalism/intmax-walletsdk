import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { FC } from "react";
import { Button } from "../ui/button";

export const ProfileDrawer: FC<{
	open: boolean;
	onChange: (open: boolean) => void;
}> = ({ open, onChange }) => {
	return (
		<Drawer open={open} onOpenChange={onChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Account Profile</DrawerTitle>
				</DrawerHeader>
				<DrawerFooter>
					<DrawerClose>
						<Button className="w-full">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
