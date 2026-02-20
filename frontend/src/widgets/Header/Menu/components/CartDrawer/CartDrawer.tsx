import { clearCart, initCartProducts } from "@/entities/cart/model/slice";
import { CartProductsList } from "@/entities/cart/ui";
import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { RootState } from "@/shared/lib/store";
import type { CartItemType } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Avatar, Drawer, Flex, Typography } from "antd";
import { ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

export default function Cart() {
	const user: YandexUserInfo = storage.getUserInfo();
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

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await api.get(`/cart/${user.id}`);
				const items = response.data.cart.items.map((item: CartItemType) => ({
					...item.product,
					quantity: item.quantity,
				}));

				dispatch(initCartProducts(items));
			} catch (e) {
				console.log(e);
			}
		};

		fetchCart();
	}, []);

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
