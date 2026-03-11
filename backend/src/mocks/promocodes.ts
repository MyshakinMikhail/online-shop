import type { PromocodeAttributes } from "../models/Promocode.ts";

export const mockPromocodes: Omit<PromocodeAttributes, "id">[] = [
	{
		name: "WELCOME10",
		isActive: true,
		discount: 10,
	},
	{
		name: "SUMMER15",
		isActive: true,
		discount: 15,
	},
	{
		name: "BLACKFRIDAY30",
		isActive: false,
		discount: 30,
	},
	{
		name: "NEWYEAR20",
		isActive: true,
		discount: 20,
	},
	{
		name: "VIP25",
		isActive: false,
		discount: 25,
	},
];
