import { Chain, WindowProvider } from "wagmi-v1";
import { InjectedConnector } from "wagmi-v1/connectors/injected";
import { ethereumProvider, webmaxDappClient } from "../../dapp";
import { DappMetadata } from "../../types/protocol";

export type WebmaxConnectorOptions = {
	metadata?: DappMetadata;
	wallet: { name?: string; url: string };
	defaultChainId?: number;
};

const DEFAULT_METADATA: DappMetadata = {
	name: "Wagmi",
	description: "Wagmi Connector",
	icons: [],
};

export class WebmaxConnector extends InjectedConnector {
	readonly id = "metaMask";

	protected shimDisconnectKey = `${this.id}.shimDisconnect`;

	constructor(config: { chains?: Chain[]; options: WebmaxConnectorOptions }) {
		const {
			chains,
			options: { wallet, metadata },
		} = config;

		const httpRpcUrls = Object.fromEntries(
			(config.chains || []).map((chain) => [chain.id, chain.rpcUrls.default.http[0]]),
		);
		const clinet = webmaxDappClient({
			wallet: { url: wallet.url, name: wallet.name || "Webmax" },
			metadata: metadata || DEFAULT_METADATA,
			providers: { eip155: ethereumProvider({ httpRpcUrls }) },
		});
		const provider = clinet.provider("eip155");

		const options = {
			name: config.options.wallet.name,
			shimDisconnect: true,
			getProvider: () => provider as WindowProvider,
		};

		super({ chains, options });
	}
}
