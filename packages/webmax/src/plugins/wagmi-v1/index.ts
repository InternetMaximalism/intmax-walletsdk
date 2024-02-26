import { Chain, WindowProvider } from "wagmi-v1";
import { InjectedConnector } from "wagmi-v1/connectors/injected";
import { ethereumProvider, webmaxDappClient } from "../../dapp";
import { DappMetadata } from "../../types/protocol";

export type WalletNextConnectorOptions = {
	chains?: Chain[];
	metadata?: DappMetadata;
	wallet: { name?: string; url: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

const DEFAULT_METADATA: DappMetadata = {
	name: "Wagmi",
	description: "Wagmi Connector",
	icons: [],
};

export class WalletNextConnector extends InjectedConnector {
	readonly id = `walletnext-${this.options.name || "wallet"}`;

	protected shimDisconnectKey = `${this.id}.shimDisconnect`;

	constructor(config: WalletNextConnectorOptions) {
		const { chains, wallet, metadata, mode } = config;

		const httpRpcUrls = Object.fromEntries(
			(config.chains || []).map((chain) => [chain.id, chain.rpcUrls.default.http[0]]),
		);
		const clinet = webmaxDappClient({
			wallet: { url: wallet.url, name: wallet.name || "Webmax", window: { mode } },
			metadata: metadata || DEFAULT_METADATA,
			providers: { eip155: ethereumProvider({ httpRpcUrls }) },
		});
		const provider = clinet.provider("eip155");

		const options = {
			name: wallet.name,
			shimDisconnect: true,
			getProvider: () => provider as WindowProvider,
		};

		super({ chains, options });
	}
}
