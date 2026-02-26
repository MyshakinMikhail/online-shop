import { type UserAttributes } from "../models/User.ts";

export const mockUsers: UserAttributes[] = [
	{
		role: "admin",
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
		role: "super_admin",
		psuid: "1553467676",
		first_name: "Миша",
		last_name: "Мышакин",
		sex: "male",
		default_email: "myshakinm@mail.ru",
		is_buying_smth: false,
	},
];
