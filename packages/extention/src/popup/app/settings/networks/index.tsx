import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Network } from "@/core/types";
import { useNetworksStore } from "@/popup/stores/network";
import { useSettingsStore } from "@/popup/stores/settings";
import { PlusCircle } from "lucide-react";
import { SettingsHeader } from "../settings-header";
import { NetworkDialog } from "./network-dialog";

function NetworkSettingsPage() {
	const networks = useNetworksStore((state) => state.networks);
	const setNetworks = useNetworksStore((state) => state.setNetworks);
	const isTestMode = useSettingsStore((state) => state.isTestMode);

	const handleNetworkChange = (network: Network | null) => {
		if (network) {
			setNetworks(networks?.map((n) => (n.chainId === network.chainId ? network : n)) ?? []);
		}
	};

	const handleNetworkRemove = (wallet: Network) => {
		setNetworks(networks?.filter((n) => n.chainId !== wallet.chainId) ?? []);
	};

	return (
		<div className="flex flex-col">
			<SettingsHeader backTo="/" title="Manage Networks" />
			<div className="grid p-2 gap-2">
				{networks
					?.filter((network) => isTestMode || !network.isTestMode)
					.map((network) => (
						<div key={network.namespace + network.chainId} className="flex items-center gap-2 p-2 overflow-x-hidden">
							<div>
								<Avatar>
									{network.logoUrl && <AvatarImage src={network.logoUrl} />}
									<AvatarFallback>{network.name?.slice(0, 2)}</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex-1 overflow-hidden">
								<div className="font-semibold truncate">{network.name ?? "Unknown"}</div>
								<div className="text-sm text-muted-foreground truncate">{`${network.namespace}:${network.chainId}`}</div>
							</div>
							<div>
								<NetworkDialog
									network={network}
									onNetworkChange={handleNetworkChange}
									onRemove={() => handleNetworkRemove(network)}
								>
									<Button variant="outline">Edit</Button>
								</NetworkDialog>
							</div>
						</div>
					))}

				<NetworkDialog network={null} onNetworkChange={handleNetworkChange}>
					<Button variant="outline">
						<PlusCircle className="mr-2" />
						Add New Network
					</Button>
				</NetworkDialog>
			</div>
		</div>
	);
}

export default NetworkSettingsPage;
