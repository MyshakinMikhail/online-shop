import type { CategoryAttributes } from "../models/Category.ts";
import Category from "../models/Category.ts";

export const seedCategories = async (): Promise<void> => {
	try {
		const categories: CategoryAttributes[] = [
			{ id: 1, name: "Все товары", slug: "all" },
			{ id: 2, name: "Футболки", slug: "tShirts" },
			{ id: 3, name: "Худи", slug: "hoodies" },
			{ id: 4, name: "Лонгсливы", slug: "longSleeves" },
			{ id: 5, name: "Штаны", slug: "trousers" },
		];

		// Используем findOrCreate для идемпотентности
		for (const category of categories) {
			await Category.findOrCreate({
				where: { id: category.id },
				defaults: category,
			});
		}

		console.log(`✅ ${categories.length} categories seeded`);
	} catch (error) {
		console.error("❌ Error seeding categories:", error);
		throw error;
	}
};

// Для очистки (опционально)
export const clearCategories = async (): Promise<void> => {
	await Category.destroy({ where: {}, truncate: true });
	console.log("🗑️ Categories cleared");
};
