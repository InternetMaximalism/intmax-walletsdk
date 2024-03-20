import { ENSAccount } from "@/lib/blockchain/ens";
import { InternalTxRequest, Token } from "@/types";
import { DappMetadata, WalletHost } from "intmax-walletsdk";
import { Account, Hash, Hex } from "viem";
import { create } from "zustand";

export type DrawerPropsPattern =
	| {
			id: "token-detail";
			account: Account;
			token: Token;
	  }
	| {
			id: "profile";
			account: ENSAccount;
	  }
	| {
			id: "onboarding";
	  }
	| {
			id: "send-input";
			transfer: { account: Account; token?: Token; to?: string; amount?: string };
	  }
	| {
			id: "send-transaction";
			dappMetadata?: DappMetadata;
			transaction: InternalTxRequest;
			onSign?: (hash: Hash) => void;
			onCancel?: () => void;
	  }
	| {
			id: "sign-transaction";
			dappMetadata?: DappMetadata;
			transaction: InternalTxRequest;
			onSign?: (tx: Hex) => void;
			onCancel?: () => void;
	  }
	| {
			id: "sign-message";
			account: Account;
			dappMetadata?: DappMetadata;
			data: Hex;
			onSign?: (signature: Hex) => void;
			onCancel?: () => void;
	  }
	| {
			id: "sign-typed-data";
			dappMetadata?: DappMetadata;
			account: Account;
			chainId: string;
			data: object;
			onSign?: (signature: Hex) => void;
			onCancel?: () => void;
	  }
	| {
			id: "webmax-connect";
			host: WalletHost;
			dappMetadata: DappMetadata;
			onConnect: () => void;
			onCancel: () => void;
	  };

type HisoricalDrawerPropsPattern = DrawerPropsPattern & { previos?: HisoricalDrawerPropsPattern };

export type DrawerProps<T extends DrawerPropsPattern["id"]> = Omit<Extract<DrawerPropsPattern, { id: T }>, "id"> & {
	onOpenChange: (open: boolean) => void;
	setLock: (lock: boolean) => void;
	previos?: HisoricalDrawerPropsPattern | null;
	back: () => void;
	open: (props: DrawerPropsPattern, previos?: HisoricalDrawerPropsPattern) => void;
};

export type DrawerState = {
	lock: boolean;
	props: HisoricalDrawerPropsPattern | null;
	setDrawerProps: (props: HisoricalDrawerPropsPattern | null) => void;
	setLock: (lock: boolean) => void;
};

const initialState = {
	props: null,
	lock: false,
};

export const useDrawerStore = create<DrawerState>((set) => ({
	...initialState,
	setDrawerProps: (props) => set((stat) => ({ ...stat, props })),
	setLock: (lock) => set((stat) => ({ ...stat, lock })),
}));
