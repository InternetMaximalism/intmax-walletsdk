import { FC } from "react";
import { WebmaxHost as Host, parseWebmaxHost } from "webmax2";

export const WebmaxHost: FC<{
	host: Host;
}> = ({ host }) => {
	const { origin, url } = parseWebmaxHost(host);
	const dappUrl = url ? url : origin;

	return (
		<div className="flex justify-between px-2 py-4 border rounded-md">
			<div className="font-semibold">Host</div>
			<a
				href={dappUrl}
				target="_blank"
				rel="noreferrer noopener"
				className="text-right truncate text-muted-foreground hover:underline underline-offset-2"
			>
				{dappUrl}
			</a>
		</div>
	);
};
