import { MenuIcon } from "@/shared/ui";
import { Flex } from "antd";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cart from "./components/Cart";
import FavouritesDrawer from "./components/FavouritesDrawer";
import SearchDrawer from "./components/SearchDrawer/SearchDrawer";
import classes from "./Menu.module.css";

export default function Menu() {
	const navigate = useNavigate();

	return (
		<Flex className={classes.menu} gap={6} align="center">
			<SearchDrawer />
			<MenuIcon
				Icon={UserRound}
				onClick={() => {
					navigate("/profile");
				}}
			/>
			<FavouritesDrawer />
			<Cart />
		</Flex>
	);
}
