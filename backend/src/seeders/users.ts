// src/seeders/002-users.ts
import { mockUsers } from "../mocks/users.ts";
import type { UserAttributes } from "../models/User.ts";
import { User } from "../models/User.ts";

export const seedUsers = async (): Promise<void> => {
	try {
		const users: UserAttributes[] = mockUsers

		for (const user of users) {
			await User.findOrCreate({
				where: { psuid: user.psuid },
				defaults: user,
			});
		}

		console.log(`✅ ${users.length} users seeded`);
	} catch (error) {
		console.error("❌ Error seeding users:", error);
		throw error;
	}
};
