import { UserAttributes } from "../../models/User";

export const mockTestUser: UserAttributes = {
	role: "user",
	psuid: 1,
	first_name: "Test",
	last_name: "Test",
	sex: "male",
	default_email: "test@example.com",
	is_buying_smth: false,
};

export const mockTestAdmin: UserAttributes = {
	role: "admin",
	psuid: 2,
	first_name: "Test",
	last_name: "Test",
	sex: "male",
	default_email: "test@example.com",
	is_buying_smth: true,
};
