import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBalances } from "@/hooks/balance";
import { usePaste } from "@/hooks/utils";
import { DrawerProps } from "@/stores/drawers";
import { InternalTransactionRequest, Token } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { isAddress, parseUnits } from "viem";
import { z } from "zod";
import { TokenSelect } from "../token-select";

const schema = z.object({
	token: z.object({}),
	to: z.string().refine((v) => isAddress(v) || /^.+\.eth$/.test(v), { message: "Invalid address or ENS name" }),
	amount: z.string().refine((v) => /^\d+(\.\d{0,18})?$/.test(v), { message: "Invalid amount" }),
});

//TODO: Refactor to zod and rhf stack
const SendDrawer: FC<DrawerProps<"send-input">> = ({ back, open, previos, transfer }) => {
	const { paste } = usePaste();

	const [titleSymbol] = useState(transfer.token?.symbol);
	const balances = useBalances(transfer.account);

	const form = useForm<z.infer<typeof schema>>({
		defaultValues: { token: transfer.token, to: transfer.to, amount: transfer.amount },
		resolver: zodResolver(schema),
	});

	const handlePaste = async () => {
		form.setValue("to", (await paste()) ?? "");
	};

	const handleSubmit = (values: z.infer<typeof schema>) => {
		const token = values.token as Token;
		const transaction: InternalTransactionRequest = {
			type: "token-transfer",
			token,
			account: transfer.account,
			to: values.to,
			amount: parseUnits(values.amount, token.decimals),
		};
		open(
			{ id: "send-transaction", transaction },
			{ id: "send-input", transfer: { ...transfer, token, to: values.to, amount: values.amount } },
		);
	};

	return (
		<>
			<DrawerHeader className="flex items-center px-2">
				{previos && (
					<Button variant="ghost" size="icon" onClick={back} className="h-10 w-10">
						<ArrowLeft />
					</Button>
				)}
				<DrawerTitle className="flex-1 text-left">{titleSymbol ? `Send ${titleSymbol}` : "Send Token"}</DrawerTitle>
				<TokenSelect
					className="w-auto"
					popverClassName="-translate-x-2"
					tokens={balances.map((b) => b.token)}
					selected={form.watch("token") as Token}
					onSelect={(token) => form.setValue("token", token)}
				/>
			</DrawerHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="px-4 space-y-2 pb-8">
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem>
									<div className="flex justify-between">
										<FormLabel htmlFor="to">Receiver (address or ENS)</FormLabel>
										<Button variant="link" size="sm" className="h-auto text-foreground" onClick={handlePaste}>
											Paste
										</Button>
									</div>
									<FormControl>
										<Input inputMode="text" placeholder="vitalik.eth or 0x1234..." {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="to">Amount</FormLabel>
									<FormControl>
										<Input inputMode="decimal" placeholder="0.00" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<DrawerFooter className="grid grid-cols-2">
						<DrawerClose asChild>
							<Button type="button" variant="outline" onClick={back}>
								Cancel
							</Button>
						</DrawerClose>
						<Button type="submit">Next</Button>
					</DrawerFooter>
				</form>
			</Form>
		</>
	);
};

export default SendDrawer;
