import type { UserCreationAttributes } from "../../models/User";

export const mockUserForCreate: UserCreationAttributes = {
	psuid: 1,
	first_name: "Test",
	last_name: "Test",
	sex: "male",
	default_email: "test@example.com",
	is_buying_smth: false,
};
