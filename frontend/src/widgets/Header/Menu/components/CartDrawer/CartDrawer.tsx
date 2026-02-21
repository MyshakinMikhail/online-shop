import { clearCart } from "@/entities/cart/model/slice";
import { CartProductsList } from "@/entities/cart/ui";
import type { RootState } from "@/shared/lib/store";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Avatar, Drawer, Flex, Typography } from "antd";
import { ShoppingCart, Trash } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

export default function Cart() {
	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch();
	const { products } = useSelector((state: RootState) => state.cart);
	const totalPrice = products.reduce((total, item) => {
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
			<MenuIcon Icon={ShoppingCart} onClick={toggleDrawer} />
			<Drawer
				title="Корзина"
				width={450}
				placement="right"
				open={open}
				onClose={toggleDrawer}
			>
				<CartProductsList toggleDrawer={toggleDrawer} />
				<div>
					<Text>Итоговая сумма: {totalPrice} рублей</Text>
					<Flex justify="center" align="center" gap={5}>
						<Avatar onClick={handleDelete}>
							<Trash />
						</Avatar>
						<MyButton onClick={handleBuy} />
					</Flex>
				</div>
			</Drawer>
		</>
	);
}
