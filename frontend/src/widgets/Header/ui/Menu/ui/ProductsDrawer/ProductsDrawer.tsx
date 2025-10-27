import { BuyButton, MenuIcon } from "@/shared/ui";
import { Drawer, type DrawerProps } from "antd";
import { useState, type ComponentType } from "react";
import { ProductsList } from "../ProductsList";

type Props = {
	Icon: ComponentType<{ size: number; color: string }>;
} & DrawerProps;

export default function ProductsDrawer({ Icon, ...props }: Props) {
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
				<ProductsList />
				<BuyButton />
			</Drawer>
		</>
	);
}
