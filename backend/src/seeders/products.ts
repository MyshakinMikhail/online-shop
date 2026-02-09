// src/seeders/003-products.ts
import Category from "../models/Category.ts";
import type { ProductAttributes } from "../models/Product.ts";
import Product from "../models/Product.ts";

export const seedProducts = async (): Promise<void> => {
	try {
		// Получаем категории для связей
		const categories = await Category.findAll();
		if (categories.length === 0) {
			throw new Error("Categories not found. Run categories seeder first.");
		}

		const products: Omit<ProductAttributes, "id">[] = [
			{
				name: "Футболка Basic Black",
				description:
					"Классическая черная футболка из 100% хлопка. Универсальный базовый элемент гардероба.",
				sizes: ["XS", "S", "M", "L", "XL"],
				article: "TSH-BLK-001",
				price: 1990,
				category: "tShirts",
				categoryId: categories[0].id, // Футболки
				stock: 150,
				image_url: "https://example.com/tshirt-black.jpg",
				images: [
					"https://example.com/tshirt-black-1.jpg",
					"https://example.com/tshirt-black-2.jpg",
				],
				is_active: true,
			},
			{
				name: "Худи Oversize Grey",
				description:
					"Утепленное худи оверсайз с капюшоном. Премиальный флис, карман-кенгуру.",
				sizes: ["S", "M", "L", "XL", "XXL"],
				article: "HOD-GRY-001",
				price: 4990,
				category: "hoodies",
				categoryId: categories[1].id, // Худи
				stock: 75,
				image_url: "https://example.com/hoodie-grey.jpg",
				images: [
					"https://example.com/hoodie-grey-1.jpg",
					"https://example.com/hoodie-grey-2.jpg",
					"https://example.com/hoodie-grey-3.jpg",
				],
				is_active: true,
			},
			{
				name: "Лонгслив Premium White",
				description:
					"Длинный рукав из премиального хлопка. Приталенный крой, манжеты на резинке.",
				sizes: ["XS", "S", "M", "L"],
				article: "LS-WHT-001",
				price: 3490,
				category: "longSleeves",
				categoryId: categories[2].id, // Лонгсливы
				stock: 90,
				image_url: "https://example.com/longsleeve-white.jpg",
				is_active: true,
			},
			{
				name: "Джинсы Slim Fit",
				description:
					"Слимочные джинсы из эластичного денима. Современный крой, пять карманов.",
				sizes: ["28", "30", "32", "34", "36"],
				article: "JNS-BLU-001",
				price: 5990,
				category: "trousers",
				categoryId: categories[3].id, // Штаны
				stock: 60,
				image_url: "https://example.com/jeans-blue.jpg",
				images: [
					"https://example.com/jeans-blue-1.jpg",
					"https://example.com/jeans-blue-2.jpg",
				],
				is_active: true,
			},
			{
				name: "Футболка Graphic Print",
				description: "Футболка с уникальным графическим принтом. Лимитированная коллекция.",
				sizes: ["S", "M", "L", "XL"],
				article: "TSH-GRP-001",
				price: 2490,
				category: "tShirts",
				categoryId: categories[0].id,
				stock: 45,
				image_url: "https://example.com/tshirt-graphic.jpg",
				is_active: true,
			},
			{
				name: "Худи Zip Hoodie",
				description:
					"Худи на молнии с двумя боковыми карманами. Удобно для занятий спортом.",
				sizes: ["M", "L", "XL", "XXL"],
				article: "HOD-ZIP-001",
				price: 5490,
				category: "hoodies",
				categoryId: categories[1].id,
				stock: 30,
				image_url: null,
				is_active: false, // Неактивный товар
			},
		];

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
