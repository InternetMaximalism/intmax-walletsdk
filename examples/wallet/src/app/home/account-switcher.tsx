import { AccountAvatar } from "@/components/AccountAvatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAccount, useAccounts } from "@/hooks/account";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export const AccountSwitcher = () => {
	const [open, setOpen] = useState(false);
	const account = useAccount();
	const accounts = useAccounts();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a team"
					className="w-48 justify-between"
				>
					<AccountAvatar className="mr-2 h-5 w-5" account={account} />
					<span className="truncate">{account?.ens || account?.address}</span>
					<ChevronDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-48 p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search team..." />
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Accounts">
							{accounts.map((_account) => (
								<CommandItem key={_account?.address} className="text-sm">
									<AccountAvatar className="mr-2 h-5 w-5" account={_account} />
									<span className="truncate">{_account?.ens || _account?.address}</span>
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4 shrink-0",
											_account.address === account?.address ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem>
								<PlusCircleIcon className="mr-2 h-5 w-5" />
								Create new
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};