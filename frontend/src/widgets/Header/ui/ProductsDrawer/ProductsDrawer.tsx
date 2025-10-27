import { Drawer, Flex, type DrawerProps } from "antd";
import { useState, type ComponentType } from "react";
import { mockProducts } from "../../mocks";
import { type Product } from "../../types/";
import MenuIcon from "../MenuIcon/MenuIcon";
import ProductCard from "../ProductCard/ProductCard";
import classes from "./ProductsDrawer.module.css";

type Props = {
	Icon: ComponentType<{ size: number; color: string }>;
} & DrawerProps;

export default function ProductsDrawer({ Icon, ...props }: Props) {
	const products = mockProducts;
	const [open, setOpen] = useState<boolean>(false);

	const toggleDrawer = () => {
		setOpen((open) => !open);
	};

	return (
		<>
			<MenuIcon Icon={Icon} onClick={toggleDrawer} />
			<Drawer
				width={450}
				placement="right"
				open={open}
				onClose={toggleDrawer}
				{...props}
			>
				<Flex className={classes.products}>
					{products.map((product: Product) => (
						<ProductCard product={product} />
					))}
				</Flex>
			</Drawer>
		</>
	);
}
