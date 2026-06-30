// src/seeders/002-users.ts
import { mockUsers } from "../mocks/users/mockUsers";
import Cart from "../models/Cart";
import { User, type UserAttributes } from "../models/User";

export const seedUsers = async (): Promise<void> => {
	try {
		const users: UserAttributes[] = mockUsers;

		for (const user of users) {
			const [createdUser] = await User.findOrCreate({
				where: { psuid: user.psuid },
				defaults: user,
			});

			await Cart.findOrCreate({
				where: { userId: createdUser.id },
				defaults: { userId: createdUser.id },
			});
		}

		console.log(`✅ ${users.length} users seeded`);
	} catch (error) {
		console.error("❌ Error seeding users:", error);
		throw error;
	}
};
