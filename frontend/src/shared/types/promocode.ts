export type Promocode = {
	id: number;
	name: string;
	isActive: boolean;
	discount: number;
};

export type CreationPromocode = Omit<Promocode, "id">;
