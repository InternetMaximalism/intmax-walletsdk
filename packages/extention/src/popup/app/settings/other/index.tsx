import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/popup/stores/settings";
import { SettingsHeader } from "../settings-header";

function OtherSettingsPage() {
	const { settings, setTestMode } = useSettingsStore();

	return (
		<div className="flex flex-col">
			<SettingsHeader backTo="/" title="Settings" />
			<div className="grid p-2 gap-2 py-4">
				<h3 className="text-lg font-medium">Developer Settings</h3>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 gap-2 shadow-sm">
					<div className="space-y-0.5">
						<Label>Test mode</Label>
						<div className="text-[0.8rem] text-muted-foreground">Show Testnet and Demo Wallets</div>
					</div>
					<Switch checked={settings?.isTestMode ?? false} onCheckedChange={(checked) => setTestMode(checked)} />
				</div>
				<div className="text-muted-foreground">
					See the{" "}
					<a
						href="https://github.com/InternetMaximalism/intmaxwallet-sdk"
						target="_blank"
						rel="noreferrer"
						className="hover:underline text-foreground font-semibold"
					>
						GitHub repository
					</a>{" "}
					for more information.
				</div>
			</div>
		</div>
	);
}

export default OtherSettingsPage;
