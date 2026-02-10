import type { Category } from "@/shared/types";

export type Product = {
	id: string;
	name: string;
	description: string;
	size: string;
	article: string;
	price: number;
	category: Category;
	stock: number;
};
