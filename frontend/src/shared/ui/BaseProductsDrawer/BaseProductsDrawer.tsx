import { MiniProductsList } from "@/entities/product/ui";
import type { ProductCardType } from "@/shared/types";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Drawer } from "antd";
import { useState } from "react";

type Props = {
	Icon: React.ComponentType<{ size: number; color: string }>;
	title: string;
	type: ProductCardType;
};

export default function BaseProductsDrawer({ Icon, title, type }: Props) {
	const [open, setOpen] = useState<boolean>(false);

	const handleClick = () => {
		console.log("Купили чо-та)");
	};

	const toggleDrawer = () => {
		setOpen((open) => !open);
	};

	return (
		<>
			<MenuIcon Icon={Icon} onClick={toggleDrawer} />
			<Drawer
				title={title}
				width={450}
				placement="right"
				open={open}
				onClose={toggleDrawer}
			>
				<MiniProductsList type={type} toggleDrawer={toggleDrawer} />
				{type === "cart" && <MyButton onClick={handleClick} />}
			</Drawer>
		</>
	);
}
