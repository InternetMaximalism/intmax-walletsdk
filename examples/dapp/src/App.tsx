import { Button } from "@/components/ui/button";
import { webmaxDappClient } from "webmax2/dapp";

const webmax = webmaxDappClient({
	url: import.meta.env.VITE_WALLET_URL as string,
	name: "DEMO Wallet",
});

function App() {
	const handleClick = async () => {
		await webmax.connect();

		const ethereum = webmax.provider("eip155");
		const accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
		console.log("accounts", accounts);

		const result1 = await ethereum.request({
			method: "eth_sign",
			params: [accounts[0], "Hello"],
		});
		const result2 = await ethereum.request({
			method: "eth_sign",
			params: [accounts[0], "Hello"],
		});
		console.log("result", await result1);
	};

	return (
		<>
			<Button onClick={handleClick}>Click me</Button>
		</>
	);
}

export default App;
