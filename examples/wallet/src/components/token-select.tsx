import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTokenWithChain, useTokensWithChain } from "@/hooks/blockchain";
import { tokenKey } from "@/lib/blockchain/utils";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import { CheckIcon, ChevronDown } from "lucide-react";
import { FC } from "react";
import { TokenAvatar } from "./token-avatar";

export const TokenSelect: FC<{
	tokens: Token[];
	selected?: Token;
	onSelect?: (token: Token) => void;
	className?: string;
	popverClassName?: string;
}> = ({ selected, tokens, onSelect, className, popverClassName }) => {
	const { chain } = useTokenWithChain(selected ? { token: selected } : null) ?? { chain: null };
	const chainedTokens = useTokensWithChain(tokens.map((token) => ({ token })));

	return (
		<Popover>
			<PopoverTrigger asChild>
				{selected ? (
					<Button variant="outline" role="combobox" className={cn("w-full justify-between overflow-hidden", className)}>
						<TokenAvatar token={selected} chain={chain} sizeRem={1.25} />
						<span className="truncate mx-2">{`${selected?.symbol}`}</span>
						<ChevronDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
					</Button>
				) : (
					<Button variant="outline" role="combobox" className={cn("w-full justify-between overflow-hidden", className)}>
						<span className="text-muted-foreground font-semibold">Select token</span>
						<ChevronDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className={cn("p-0 w-full", popverClassName)}>
				<Command>
					<CommandList>
						<CommandInput placeholder="Search team..." />
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="Tokens">
							<ScrollArea className="h-full max-h-48">
								{chainedTokens.map(({ token, chain }) => (
									<CommandItem key={`${tokenKey(token)}`} className="text-sm" onSelect={() => onSelect?.(token)}>
										<TokenAvatar token={token} chain={chain} sizeRem={1.25} />
										<span className="truncate ml-2">{`${token.name} (${token?.symbol})`}</span>
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4 shrink-0",
												selected && tokenKey(selected) === tokenKey(token) ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}{" "}
								<ScrollBar />
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
