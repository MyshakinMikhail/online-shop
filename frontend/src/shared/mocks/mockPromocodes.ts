import type { Promocode } from "@/shared/types/promocode";

export const mockPromocodes: Promocode[] = [
	{
		id: 1,
		name: "WELCOME10",
		isActive: true,
		discount: 10,
	},
	{
		id: 2,
		name: "SUMMER15",
		isActive: true,
		discount: 15,
	},
	{
		id: 3,
		name: "BLACKFRIDAY30",
		isActive: false,
		discount: 30,
	},
	{
		id: 4,
		name: "NEWYEAR20",
		isActive: true,
		discount: 20,
	},
	{
		id: 5,
		name: "VIP25",
		isActive: false,
		discount: 25,
	},
];
