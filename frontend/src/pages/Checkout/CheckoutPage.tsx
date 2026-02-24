import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { CartProductsList } from "@/entities/cart/ui";
import type { AppDispatch } from "@/shared/lib/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import classes from "./CheckoutPage.module.css";
import { Form, Header } from "./components";

export default function CheckoutPage() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getCartProducts());
	}, [dispatch]);

	return (
		<div className={classes.page}>
			<Header />
			<div className={classes.body}>
				<Form />
				<CartProductsList />
			</div>
		</div>
	);
}
