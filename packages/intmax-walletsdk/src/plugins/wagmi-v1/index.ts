import { Chain, WindowProvider } from "wagmi-v1";
import { InjectedConnector } from "wagmi-v1/connectors/injected";
import { ethereumProvider, intmaxDappClient } from "../../dapp";
import { DappMetadata } from "../../types/protocol";

export type IntmxWalletSDKConnectorOptions = {
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

export class IntmxWalletSDKConnector extends InjectedConnector {
	readonly id;

	protected shimDisconnectKey = `${this.id}.shimDisconnect`;

	constructor(config: IntmxWalletSDKConnectorOptions) {
		const { chains, wallet, metadata, mode } = config;

		const httpRpcUrls = Object.fromEntries(
			(config.chains || []).map((chain) => [chain.id, chain.rpcUrls.default.http[0]]),
		);
		const clinet = intmaxDappClient({
			wallet: { url: wallet.url, name: wallet.name || "INTMAX Wallet", window: { mode } },
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

		this.id = `intmax:${wallet.url}`;
	}
}
