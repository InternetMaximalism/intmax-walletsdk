import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/account";
import { useDrawer } from "@/hooks/drawer";
import { ArrowDown, ArrowUp } from "lucide-react";

export const MainActions = () => {
	const account = useAccount();
	const { open } = useDrawer();

	return (
		<div className="grid grid-cols-2 gap-4">
			<Button
				disabled={!account || account.type === "json-rpc"}
				onClick={() => account && open({ id: "send-input", transfer: { account } })}
			>
				<ArrowUp className="mr-2 h-5 w-5" />
				Send
			</Button>
			<Button onClick={() => account && open({ id: "profile", account })} disabled={!account}>
				<ArrowDown className="mr-2 h-5 w-5" />
				Recive
			</Button>
		</div>
	);
};
