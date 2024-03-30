import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useSignMessage } from "wagmi";

function App() {
	const [signature, setSignature] = useState<string>("");
	const [error, setError] = useState<string>("");
	const { signMessage } = useSignMessage({});

	const handleSignMessage = async () => {
		await signMessage(
			{ message: "Hello, World!" },
			{ onSuccess: setSignature, onError: (error) => setError(error.message) },
		);
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
					flexDirection: "column",
					alignItems: "center",
					padding: 12,
				}}
			>
				<button type="button" onClick={handleSignMessage}>
					Sign Message
				</button>
				<div
					style={{
						maxWidth: "40rem",
						wordBreak: "break-all",
						textAlign: "center",
					}}
				>
					{signature && <p>Signature: {signature}</p>}
					{error && <p>Error: {error}</p>}
				</div>
			</div>
		</div>
	);
}

export default App;
