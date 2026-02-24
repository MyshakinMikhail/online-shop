import { clearCart } from "@/entities/cart/model/slice";
import { CartProductsList } from "@/entities/cart/ui";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Avatar, Drawer, Flex, Typography } from "antd";
import { ShoppingCart, Trash } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function Cart() {
	const navigate = useNavigate();

	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();
	const { products, totalPrice } = useSelector((state: RootState) => state.cart);

	const handleBuy = () => {
		navigate("/checkout");
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
			<MenuIcon totalCount={products.length} Icon={ShoppingCart} onClick={toggleDrawer} />
			<Drawer
				title="Корзина"
				width={450}
				placement="right"
				open={open}
				onClose={toggleDrawer}
			>
				<CartProductsList toggleDrawer={toggleDrawer} />
				<div>
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
