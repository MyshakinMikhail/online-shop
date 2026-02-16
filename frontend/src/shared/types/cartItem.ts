import type { Product } from "./product";

export type CartItemType = {
	id: number;
	cartId: number;
	productId: number;
	product?: Product;
	quantity?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type MiniCartItemType = {
	product: Product;
	quantity: number;
};

/// по хорошему избавиться от этих типов !!!
