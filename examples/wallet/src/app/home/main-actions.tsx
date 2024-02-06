import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/stores/drawers";
import { ArrowDown, ArrowUp } from "lucide-react";

export const MainActions = () => {
	const setDrawerProps = useDrawerStore((state) => state.setDrawerProps);

	return (
		<div className="grid grid-cols-2 gap-4">
			<Button>
				<ArrowUp className="mr-2 h-5 w-5" />
				Send
			</Button>
			<Button onClick={() => setDrawerProps({ id: "profile" })}>
				<ArrowDown className="mr-2 h-5 w-5" />
				Recive
			</Button>
		</div>
	);
};
