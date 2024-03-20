import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network } from "@/core/types";
import { cn } from "@/lib/utils";
import { Namespace } from "intmax-walletsdk";
import { FC, ReactNode, useState } from "react";

export const NetworkDialog: FC<{
	children: ReactNode;
	network: Network | null;
	onNetworkChange: (walnetworklet: Network | null) => void;
	onRemove?: () => void;
}> = ({ children, network: defaultNetwork, onNetworkChange, onRemove }) => {
	const [network, setNetwork] = useState<Partial<Network>>(defaultNetwork ?? {});

	const isValidated = network.namespace && network.chainId && network.httpRpcUrl;

	const handleSave = () => {
		if (isValidated) {
			onNetworkChange(network as Network);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Network Config</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Network Display Name(Optional)"
							value={network?.name ?? ""}
							onChange={(e) => e.target.value && setNetwork({ ...network, name: e.target.value })}
						/>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="namespace">Namespace</Label>
						<Input
							id="namespace"
							placeholder="Namespace"
							value={network?.namespace ?? ""}
							onChange={(e) => e.target.value && setNetwork({ ...network, namespace: e.target.value as Namespace })}
						/>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="chainId">Chain ID</Label>
						<Input
							id="chainId"
							placeholder="Chain ID"
							type="number"
							value={network?.chainId ?? ""}
							onChange={(e) => e.target.value && setNetwork({ ...network, chainId: Number(e.target.value) })}
						/>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="httpRpcUrl">HTTP RPC URL</Label>
						<Input
							id="httpRpcUrl"
							placeholder="HTTP RPC URL"
							value={network?.httpRpcUrl ?? ""}
							onChange={(e) => e.target.value && setNetwork({ ...network, httpRpcUrl: e.target.value })}
						/>
					</div>
				</div>
				<DialogFooter className={cn("grid gap-2", onRemove && "grid-cols-2")}>
					{onRemove && (
						<DialogClose asChild>
							<Button type="button" variant="destructive" onClick={onRemove}>
								Remove
							</Button>
						</DialogClose>
					)}
					<DialogClose asChild>
						<Button type="button" disabled={!isValidated} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
