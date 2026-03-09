import { CartItem } from "../models/index.ts";

const ActivePromocodes: Record<string, number> = {
	SALE10: 10,
	SALE20: 20,
	SALE30: 30,
	WELCOME15: 15,
	BLACKFRIDAY50: 50,
	NEWYEAR26: 25,
	SUMMER2026: 25,
	SPRING2026: 25,
};

export const OrderService = {
	calculateOrderTotal: (items: CartItem[]): number => {
		return items.reduce((sum, item) => {
			return sum + item.quantity * item.product.price;
		}, 0);
	},

	activatePromocode: (promocode: string): { isPromocodeActivate: boolean; sale: number } => {
		if (!promocode) {
			return { isPromocodeActivate: false, sale: 0 };
		}

		const normalizedPromocode = promocode.trim().toUpperCase();

		return {
			isPromocodeActivate: ActivePromocodes[normalizedPromocode] ? true : false,
			sale: ActivePromocodes[normalizedPromocode] || 0,
		};
	},

	getPriceWithPromocode: (
		totalPrice: number,
		promocode: string
	): { finalPrice: number; isPromocodeActivate: boolean; sale: number } => {
		const { isPromocodeActivate, sale } = OrderService.activatePromocode(promocode);
		return {
			finalPrice: Math.round(totalPrice - (totalPrice * sale) / 100),
			isPromocodeActivate,
			sale,
		};
	},
};
