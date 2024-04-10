import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ethereumProvider, intmaxDappClient } from "intmax-walletsdk/dapp";
import { useState } from "react";

const DEFAULT_WALLET_URL = import.meta.env.VITE_WALLET_URL || " https://intmaxwallet-sdk-wallet.vercel.app/";
const DEFAULT_DAPP_ICON = (import.meta.env.VITE_APP_ICON || `${window.location.origin}/vite.svg`) as string;
const DAPP_METADATA = {
	name: "sdk Dapp Example",
	description: "This is a simple example of how to use the sdk dapp client.",
	icons: [DEFAULT_DAPP_ICON],
};

const createsdk = (walletUrl: string) => {
	return intmaxDappClient({
		wallet: { url: walletUrl, name: "DEMO Wallet", window: { mode: "popup" } },
		metadata: DAPP_METADATA,
		providers: { eip155: ethereumProvider() },
	});
};

function App() {
	const [walletUrl, setWalletUrl] = useState(DEFAULT_WALLET_URL);
	const [sdk, setsdk] = useState(createsdk(DEFAULT_WALLET_URL));

	const [accounts, setAccounts] = useState<string[]>([]);
	const [result, setResult] = useState<string>("");

	const isValidUrl = /https?:\/\/[^\s$.?#].[^\s]*$/.test(walletUrl);
	const handleUpdateWalletUrl = (url: string) => {
		if (!isValidUrl) return;
		setAccounts([]);
		setsdk(createsdk(url));
	};

	const handleConnect = async () => {
		const ethereum = sdk.provider("eip155");
		await ethereum.request({ method: "eth_requestAccounts", params: [] });
		const accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		setAccounts(accounts);
	};

	const handleSignMessage = async () => {
		if (accounts.length === 0) await handleConnect();

		const ethereum = sdk.provider("eip155");
		const _accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		const result = await ethereum.request({ method: "eth_sign", params: [_accounts[0], "Hello sdk"] });

		setResult(result as string);
	};

	const handleSendTransaction = async () => {
		if (accounts.length === 0) await handleConnect();

		const ethereum = sdk.provider("eip155");
		const _accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x89" }] });
		const result = await ethereum.request({
			method: "eth_sendTransaction",
			params: [{ from: _accounts[0], to: _accounts[0], value: "0x0" }],
		});

		setResult(result as string);
	};

	const handleSignTypedData = async () => {
		if (accounts.length === 0) await handleConnect();

		const typedData = {
			types: {
				EIP712Domain: [
					{ name: "name", type: "string" },
					{ name: "version", type: "string" },
				],
				Person: [
					{ name: "name", type: "string" },
					{ name: "age", type: "uint256" },
				],
			},
			domain: { name: "sdk Dapp Example", version: "1" },
			primaryType: "Person",
			message: { name: "Bob", age: 25 },
		};

		const ethereum = await sdk.provider("eip155");
		const _accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		const result = await ethereum.request({
			method: "eth_signTypedData_v4",
			params: [_accounts[0], JSON.stringify(typedData)],
		});

		setResult(result as string);
	};

	return (
		<>
			<div className="w-full max-w-screen-sm mx-auto px-4 py-12 space-y-8">
				<div>
					<div className="text-2xl font-semibold">sdk Dapp Example</div>
					<div className="text-muted-foreground">This is a simple example of how to use the sdk dapp client.</div>
				</div>
				<div className="space-y-1">
					<div className="font-semibold text-lg">Wallet URL</div>
					<div className="flex gap-2">
						<Input placeholder="Etner wallet url" onChange={(e) => setWalletUrl(e.target.value)} value={walletUrl} />
						<Button disabled={!isValidUrl} onClick={() => handleUpdateWalletUrl(walletUrl)}>
							Update
						</Button>
					</div>
					<div className="text-muted-foreground">
						The sdk protocol allows you to connect to a wallet of any URL by specifying the wallet's URL!
					</div>
				</div>
				<div className="space-y-1">
					<div className="font-semibold text-lg">Wallet URL</div>

					<div className="text-muted-foreground">
						Copy it or whatever, register the bookmarklet above, and sdkWallet is available everywhere!
					</div>
				</div>
				<div className="gap-2 grid grid-cols-2">
					<Button onClick={handleConnect}>Connect</Button>
					<Button onClick={handleSignMessage}>Sign Message</Button>
					<Button onClick={handleSignTypedData}> Sign Typed Data</Button>
					<Button onClick={handleSendTransaction}>Send Transaction</Button>

					<div className="col-span-2">
						<div className="font-semibold">Accounts:</div>
						<div className="break-all text-muted-foreground">{accounts.join(", ")}</div>
					</div>
					<div className="col-span-2">
						<div className="font-semibold">Result:</div>
						<div className="break-all text-muted-foreground">{result}</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
