import { Flex } from "antd";
import { Heart, Search, ShoppingCart, UserRound } from "lucide-react";
import { MenuIcon } from "../../../../shared/ui";
import classes from "./Menu.module.css";

export default function Menu() {
	return (
		<Flex className={classes.menu} gap={6} align="center">
			<MenuIcon Icon={Search} />
			<MenuIcon Icon={UserRound} />
			<MenuIcon Icon={Heart} />
			<MenuIcon Icon={ShoppingCart} countNotifications={1} />
		</Flex>
	);
}
