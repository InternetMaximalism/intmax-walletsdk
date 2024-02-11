import { Button } from "@/components/ui/button";
import { webmaxDappClient } from "webmax2/dapp";

const webmax = webmaxDappClient({
	url: import.meta.env.VITE_WALLET_URL as string,
	name: "DEMO Wallet",
});

function App() {
	const handleClick = async () => {
		const ethereum = webmax.provider("eip155");
		ethereum.request({ method: "eth_sign", params: ["0x3280129f0006825fC1AcccC227993ebAdAb6c8f5", "Hello"] });
	};

	return (
		<>
			<Button onClick={handleClick}>Click me</Button>
		</>
	);
}

export default App;
