export type Product = {
	id: number;
	name: string;
	description: string;
	sizes: string[];
	article: string;
	price: number;
	isFavorite?: boolean; // Любимое или нет
	isActive: boolean;
	categoryId: number;
	stock: number;
};
