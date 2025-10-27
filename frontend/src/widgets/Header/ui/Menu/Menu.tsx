import { Flex } from "antd";
import { Heart, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./Menu.module.css";
import { MenuIcon, ProductsDrawer, SearchDrawer } from "./ui";

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
			<ProductsDrawer Icon={Heart} title="Избранное" />
			<ProductsDrawer Icon={ShoppingCart} title="Корзина" />
		</Flex>
	);
}
