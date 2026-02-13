// src/seeders/003-products.ts
import { mockProducts } from "../mocks/products.ts";
import Category from "../models/Category.ts";
import type { ProductAttributes } from "../models/Product.ts";
import { Product } from "../models/Product.ts";

export const seedProducts = async (): Promise<void> => {
	try {
		// Получаем категории для связей
		const categories = await Category.findAll();
		if (categories.length === 0) {
			throw new Error("Categories not found. Run categories seeder first.");
		}

		const products: Omit<ProductAttributes, "id">[] = mockProducts;

		for (const product of products) {
			await Product.findOrCreate({
				where: { article: product.article },
				defaults: product,
			});
		}

		console.log(`✅ ${products.length} products seeded`);
	} catch (error) {
		console.error("❌ Error seeding products:", error);
		throw error;
	}
};
