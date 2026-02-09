import type { CategoryAttributes } from "../models/Category.ts";
import Category from "../models/Category.ts";

export const seedCategories = async (): Promise<void> => {
	try {
		const categories: CategoryAttributes[] = [
			{ id: 1, name: "Футболки" },
			{ id: 2, name: "Худи" },
			{ id: 3, name: "Лонгсливы" },
			{ id: 4, name: "Штаны" },
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
