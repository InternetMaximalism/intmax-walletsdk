import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";

function App() {
	const { signMessage } = useSignMessage({
		message: "Hello, World!",
	});

	const handleSignMessage = async () => {
		const result = await signMessage();
		console.log(result);
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					padding: 12,
				}}
			>
				<ConnectButton />
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					padding: 12,
				}}
			>
				<button type="button" onClick={handleSignMessage}>
					Sign Message
				</button>
			</div>
		</div>
	);
}

export default App;
