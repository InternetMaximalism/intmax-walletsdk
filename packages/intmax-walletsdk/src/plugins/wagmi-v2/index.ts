import {
	EIP1193Provider,
	ProviderConnectInfo,
	ResourceUnavailableRpcError,
	RpcError,
	SwitchChainError,
	UserRejectedRequestError,
	getAddress,
	numberToHex,
} from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";
import { ethereumProvider, intmaxDappClient } from "../../dapp";
import { DappMetadata } from "../../types/protocol";

const DEFAULT_METADATA: DappMetadata = {
	name: "Wagmi",
	description: "Wagmi Connector",
	icons: [],
};

export type IntmaxWalletSDKParameters = {
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

intmaxwalletsdk.type = "intmaxwalletsdk";

export function intmaxwalletsdk(parameters: IntmaxWalletSDKParameters) {
	type Provider = EIP1193Provider;
	type Properties = {
		onConnect(connectInfo: ProviderConnectInfo): void;
	};
	type StorageItem = {
		[_ in "injected.connected" | `${string}.disconnected`]: true;
	};

	return createConnector<Provider, Properties, StorageItem>((config) => {
		const { wallet, metadata, mode } = parameters;
		const httpRpcUrls = Object.fromEntries(
			(config.chains || []).map((chain) => [chain.id, chain.rpcUrls.default.http[0]]),
		);
		const clinet = intmaxDappClient({
			wallet: { url: wallet.url, name: wallet.name || "INTMAX", window: { mode } },
			metadata: metadata || DEFAULT_METADATA,
			providers: { eip155: ethereumProvider({ httpRpcUrls }) },
		});
		const provider = clinet.provider(
			parameters.defaultChainId ? `eip155:${parameters.defaultChainId}` : "eip155",
		) as Provider;

		return {
			id: `intmax:${parameters.wallet.url}`,
			icon: parameters.wallet.iconUrl,
			name: parameters.wallet.name || "INTMAX Wallet",
			type: intmaxwalletsdk.type,
			async setup() {
				const provider = await this.getProvider();
				provider.on("connect", this?.onConnect?.bind(this));
			},
			async connect({ chainId } = {}) {
				try {
					const provider = await this.getProvider();

					const requestedAccounts = await provider.request({ method: "eth_requestAccounts" });
					const accounts = requestedAccounts.map((x) => getAddress(x));

					provider.removeListener("connect", this?.onConnect?.bind(this));
					provider.on("accountsChanged", this?.onAccountsChanged?.bind(this));
					provider.on("chainChanged", this?.onChainChanged?.bind(this));
					provider.on("disconnect", this?.onDisconnect?.bind(this));

					if (chainId) {
						await this.switchChain?.({ chainId }).catch((e) => {
							if (e.code === UserRejectedRequestError.code) throw e;
						});
					}

					await config.storage?.removeItem(`${this.id}.disconnected`);

					return { accounts, chainId: await this.getChainId() };
				} catch (e) {
					const error = e as RpcError;
					if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
					if (error.code === ResourceUnavailableRpcError.code) throw new ResourceUnavailableRpcError(error);
					throw error;
				}
			},
			async disconnect() {
				const provider = await this.getProvider();

				provider.removeListener("accountsChanged", this?.onAccountsChanged?.bind(this));
				provider.removeListener("chainChanged", this?.onChainChanged?.bind(this));
				provider.removeListener("disconnect", this?.onDisconnect?.bind(this));
				provider.on("connect", this?.onConnect?.bind(this));

				await config.storage?.setItem(`${this.id}.disconnected`, true);
			},

			async switchChain({ chainId }) {
				const provider = await this.getProvider();

				const chain = config.chains.find((x) => x.id === chainId);
				if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

				try {
					await Promise.all([
						provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: numberToHex(chainId) }] }),
						new Promise<void>((resolve) =>
							config.emitter.on("change", ({ chainId: newChainId }) => newChainId === chainId && resolve()),
						),
					]);
					return chain;
				} catch (e) {
					//TODO: add wallet_addEthereumChains
					throw new SwitchChainError(e as Error);
				}
			},
			async isAuthorized() {
				if (await config.storage?.getItem(`${this.id}.disconnected`)) return false;
				if (!(await this.getAccounts())?.length) return false;
				return true;
			},
			async getAccounts() {
				const provider = await this.getProvider();
				const accounts = await provider.request({ method: "eth_accounts" });
				return accounts.map((x) => getAddress(x));
			},
			async getChainId() {
				const provider = await this.getProvider();
				const chainId = await provider.request({ method: "eth_chainId" });
				return Number(chainId);
			},
			async getProvider() {
				return provider;
			},

			async onAccountsChanged(accounts) {
				if (accounts.length === 0) return await this.disconnect();
				if (!config.emitter.listenerCount("connect")) {
					return config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
				}

				const chainId = (await this.getChainId()).toString();
				this.onConnect({ chainId });
				await config.storage?.removeItem(`${this.id}.disconnected`);
			},
			async onChainChanged(chain) {
				const chainId = Number(chain);
				config.emitter.emit("change", { chainId });
			},
			async onConnect(connectInfo) {
				const accounts = await this.getAccounts();
				if (accounts.length === 0) return;

				const chainId = Number(connectInfo.chainId);
				config.emitter.emit("connect", { accounts, chainId });

				const provider = await this.getProvider();
				provider.removeListener("connect", this.onConnect.bind(this));
				provider.on("accountsChanged", this.onAccountsChanged.bind(this));
				provider.on("chainChanged", this.onChainChanged);
				provider.on("disconnect", this.onDisconnect.bind(this));
			},
			async onDisconnect(_error) {
				const provider = await this.getProvider();
				config.emitter.emit("disconnect");
				provider.removeListener("accountsChanged", this.onAccountsChanged.bind(this));
				provider.removeListener("chainChanged", this.onChainChanged);
				provider.removeListener("disconnect", this.onDisconnect.bind(this));
			},
		};
	});
}
