import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/account";
import { useDrawerStore } from "@/stores/drawers";
import { ArrowDown, ArrowUp } from "lucide-react";

export const MainActions = () => {
	const account = useAccount();
	const setDrawerProps = useDrawerStore((state) => state.setDrawerProps);

	return (
		<div className="grid grid-cols-2 gap-4">
			<Button disabled={!account || account.type === "json-rpc"}>
				<ArrowUp className="mr-2 h-5 w-5" />
				Send
			</Button>
			<Button onClick={() => account && setDrawerProps({ id: "profile", account })} disabled={!account}>
				<ArrowDown className="mr-2 h-5 w-5" />
				Recive
			</Button>
		</div>
	);
};
