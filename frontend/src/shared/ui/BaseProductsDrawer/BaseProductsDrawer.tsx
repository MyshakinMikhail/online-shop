import { clearCart } from "@/entities/cart/model/slice";
import { MiniProductsList } from "@/entities/product/ui";
import type { RootState } from "@/shared/lib/store";
import type { ProductCardType } from "@/shared/types";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Avatar, Drawer, Flex, Typography } from "antd";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

type Props = {
	Icon: React.ComponentType<{ size: number; color: string }>;
	title: string;
	type: ProductCardType;
};

export default function BaseProductsDrawer({ Icon, title, type }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch();
	const items = useSelector((state: RootState) => state.cart);
	const totalPrice = items.reduce((total, item) => {
		const itemTotal = item.price * item.quantity;
		return total + itemTotal;
	}, 0);

	const handleBuy = () => {
		console.log("Купили чо-та)");
	};

	const handleDelete = () => {
		dispatch(clearCart());
	};

	const toggleDrawer = () => {
		setOpen(open => !open);
	};

	return (
		<>
			<MenuIcon Icon={Icon} onClick={toggleDrawer} />
			<Drawer title={title} width={450} placement="right" open={open} onClose={toggleDrawer}>
				<MiniProductsList type={type} toggleDrawer={toggleDrawer} />
				{type === "cart" && (
					<>
						<Text>Итоговая сумма: {totalPrice} рублей</Text>
						<Flex justify="center" align="center" gap={5}>
							<Avatar onClick={handleDelete}>
								<Trash />
							</Avatar>
							<MyButton onClick={handleBuy} />
						</Flex>
					</>
				)}
			</Drawer>
		</>
	);
}
