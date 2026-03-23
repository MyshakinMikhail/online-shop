// Убираем ненужный импорт Model
import { sequelize } from "../db/index.ts";
import { seedCategories } from "./categories.ts";
import { seedProducts } from "./products.ts";
import { seedPromocodes } from "./promocodes.ts";
import { seedUsers } from "./users.ts";

export const seedTesting = async (): Promise<void> => {
	try {
		console.log("🧪 Seeding test data...");

		await seedCategories();
		await seedUsers();
		await seedProducts();
		await seedPromocodes();

		console.log("✅ Test data seeded successfully");
	} catch (error) {
		console.error("❌ Failed to seed test data:", error);
		throw error;
	}
};

export const clearAllData = async (): Promise<void> => {
	try {
		console.log("🗑️ Clearing all data (optimized)...");

		await sequelize.query(`
			TRUNCATE TABLE 
				products, 
				users, 
				categories,
				promocode
			RESTART IDENTITY CASCADE;
		`);

		console.log("✅ All data cleared (TRUNCATE CASCADE)");
	} catch (error) {
		console.error("❌ Failed to clear data:", error);
		throw error;
	}
};

// Перезапуск (очистка + заполнение)
export const reseed = async (): Promise<void> => {
	await clearAllData();
	await seedTesting();
};

// Экспортируем все сидеры
export default {
	seedTesting,
	clearAllData,
	reseed,
};
