import { AccountAvatar } from "@/components/account-avatar";
import { AccountName } from "@/components/account-name";
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
import { useAccount, useAccounts, useSwitchAccount } from "@/hooks/account";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Account } from "viem";

export const AccountSwitcher = () => {
	const [open, setOpen] = useState(false);
	const account = useAccount();
	const accounts = useAccounts();
	const switchAccount = useSwitchAccount();

	const onAccountSelect = (account: Account) => {
		switchAccount(account.address);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-48 justify-between overflow-hidden">
					<AccountAvatar className="mr-2 h-5 w-5" account={account} />
					<AccountName account={account} />
					<ChevronDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0 ml-2">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search team..." />
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Accounts">
							{accounts.map((_account) => (
								<CommandItem key={_account?.address} className="text-sm" onSelect={() => onAccountSelect(_account)}>
									<AccountAvatar className="mr-2 h-5 w-5" account={_account} />
									<AccountName account={_account} />
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
