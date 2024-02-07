import { fetchTokenPriceHistory } from "@/lib/blockchain/token";
import { tokenKey } from "@/lib/blockchain/utils";
import { Token } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTokenPriceHistory = (token: Token, scale: "1d" | "7d" | "30d") => {
	const history = useQuery({
		queryKey: ["token-price-history", tokenKey(token)],
		queryFn: () => fetchTokenPriceHistory({ token, scale }),
	});

	return history;
};
