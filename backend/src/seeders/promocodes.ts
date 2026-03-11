import { mockPromocodes } from "../mocks/promocodes.ts";
import { Promocode } from "../models/Promocode.ts";

export const seedPromocodes = async (): Promise<void> => {
	try {
		for (const promocode of mockPromocodes) {
			await Promocode.findOrCreate({
				where: { name: promocode.name },
				defaults: promocode,
			});
		}

		console.log(`✅ ${mockPromocodes.length} promocodes seeded`);
	} catch (error) {
		console.error("❌ Error seeding promocodes:", error);
		throw error;
	}
};
