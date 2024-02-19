import { Button } from "@/components/ui/button";
import { getSiteMetadata } from "@/core/libs/getSiteMetadata";
import { useEffect, useRef } from "react";
import { ethereumProvider, webmaxDappClient } from "webmax2/dapp";

const WALLET_URL = "http://localhost:5173";

function App() {
	const ref = useRef<HTMLIFrameElement>(null);

	const handleSign = async () => {
		console.log("handleSign");
		if (!ref.current?.contentWindow) return;
		const client = webmaxDappClient({
			wallet: {
				name: "Webmax",
				url: WALLET_URL,
				window: {
					mode: "custom",
					onClose: () => {},
					window: ref.current.contentWindow,
				},
			},
			metadata: getSiteMetadata(),
			providers: { eip155: ethereumProvider() },
		});

		const provider = await client.provider("eip155");
		const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
		console.log(accounts);

		const signature = await provider.request({
			method: "eth_sign",
			params: [accounts[0], "Hello world"],
		});

		console.log(signature);
	};

	return (
		<div className="w-full h-full">
			<header className="p-4 border-b flex items-center justify-between">
				<h1 className="text-lg font-bold">Webmax</h1>
				<Button size="sm" onClick={handleSign}>
					Switch Wallet
				</Button>
			</header>
			<main className="w-[320px] h-[500px] overflow-hidden">
				<iframe title="webmax" src={WALLET_URL} className="w-full h-full" ref={ref} />
			</main>
		</div>
	);
}

export default App;
