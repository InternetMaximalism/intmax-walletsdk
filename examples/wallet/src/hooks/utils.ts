import { useCallback, useMemo } from "react";

export const useShare = () => {
	const isCanShare = useMemo(() => {
		if (typeof navigator === "undefined") return false;
		if (!navigator.share) return false;
		return true;
	}, []);

	const share = useCallback(
		async (data: ShareData) => {
			if (!isCanShare) return;
			try {
				await navigator.share(data);
			} catch (e) {
				console.error(e);
			}
		},
		[isCanShare],
	);

	return { isCanShare, share };
};

export const useCopy = () => {
	const copy = useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (e) {
			console.error(e);
		}
	}, []);

	return { copy };
};

export const useDownload = () => {
	const download = useCallback((filename: string, data: string) => {
		const blob = new Blob([data], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, []);

	return { download };
};

export const usePaste = () => {
	const paste = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			return text;
		} catch (e) {
			console.error(e);
		}
	}, []);

	return { paste };
};
