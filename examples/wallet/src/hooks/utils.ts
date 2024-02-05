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
