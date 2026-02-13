import { type UserAttributes } from "../models/User.ts";

export const mockUsers: UserAttributes[] = [
	{
		role: "super_admin",
		psuid: "admin_001",
		first_name: "Александр",
		last_name: "Иванов",
		sex: "male",
		default_email: "admin@example.com",
		is_buying_smth: false,
	},
	{
		role: "admin",
		psuid: "manager_001",
		first_name: "Мария",
		last_name: "Петрова",
		sex: "female",
		default_email: "manager@example.com",
		is_buying_smth: false,
	},
	{
		role: "user",
		psuid: "user_001",
		first_name: "Иван",
		last_name: "Сидоров",
		sex: "male",
		default_email: "ivan@example.com",
		is_buying_smth: true,
	},
	{
		role: "user",
		psuid: "user_002",
		first_name: "Ольга",
		last_name: "Кузнецова",
		sex: "female",
		default_email: "olga@example.com",
		is_buying_smth: false,
	},
	{
		role: "user",
		psuid: "user_003",
		first_name: "Алексей",
		last_name: "Смирнов",
		sex: "male",
		default_email: "alex@example.com",
		is_buying_smth: true,
	},
];
