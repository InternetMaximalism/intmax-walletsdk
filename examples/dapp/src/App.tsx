import { Button } from "@/components/ui/button";
import { useState } from "react";
import { webmaxDappClient } from "webmax2/dapp";

const webmax = webmaxDappClient({
	url: import.meta.env.VITE_WALLET_URL as string,
	name: "DEMO Wallet",
});

function App() {
	const [accounts, setAccounts] = useState<string[]>([]);
	const [result, setResult] = useState<string>("");

	const handleConnect = async () => {
		await webmax.connect();
		const ethereum = webmax.provider("eip155");
		const accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		setAccounts(accounts);
	};

	const handleSignMessage = async () => {
		if (accounts.length === 0) await handleConnect();

		const ethereum = webmax.provider("eip155");
		const _accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		const result = await ethereum.request({ method: "eth_sign", params: [_accounts[0], "Hello Webmax"] });
		setResult(result as string);
	};

	return (
		<>
			<Button onClick={handleConnect}>Connect</Button>
			<Button onClick={handleSignMessage}>Sign Message</Button>
			<div>{accounts.join(", ")}</div>
			<div>{result}</div>
		</>
	);
}

export default App;
