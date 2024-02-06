import { Token } from "@/types";

export const tokenKey = (token: Token) =>
	token.type === "native" ? String(token.chainId) : `${token.chainId}:${token.address}`;
