import { CartItem } from "../models/index.ts";

export const OrderService = {
	calculateOrderTotal: (items: CartItem[]) => {
		return items.reduce((sum, item) => {
			return sum + item.quantity * item.product.price;
		}, 0);
	},
};
