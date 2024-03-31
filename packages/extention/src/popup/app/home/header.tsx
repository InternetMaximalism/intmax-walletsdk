import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXTENSION_DOC_URL } from "@/constants";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { WalletSwitcher } from "./wallet-switcher";

export const HomeHeader = () => {
	return (
		<header className="border-b p-2 flex justify-between items-center">
			<WalletSwitcher />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<Menu />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-40">
					<DropdownMenuLabel>Settings</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link to="/settings/wallets">Wallets</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings/networks">Networks</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings/other">Settings</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<a href={EXTENSION_DOC_URL} target="_blank" rel="noreferrer noopener">
								Document
							</a>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};
