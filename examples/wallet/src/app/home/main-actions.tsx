import { ProfileDrawer } from "@/components/drawers/profile-drawer";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export const MainActions = () => {
	const [isOpenReceive, setIsOpenReceive] = useState(false);

	return (
		<>
			<ProfileDrawer open={isOpenReceive} onChange={setIsOpenReceive} />
			<div className="grid grid-cols-2 gap-4">
				<Button>
					<ArrowUp className="mr-2 h-5 w-5" />
					Send
				</Button>
				<Button onClick={() => setIsOpenReceive(true)}>
					<ArrowDown className="mr-2 h-5 w-5" />
					Recive
				</Button>
			</div>
		</>
	);
};
