import { Category } from "../../models/index.ts";

export const CategoryService = {
	findBySlug: async (slug: string) => {
		return await Category.findOne({ where: { slug } });
	},
};
