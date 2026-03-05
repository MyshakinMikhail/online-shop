import { api } from "@/shared/api";

export const CategoriesServise = {
	getCategories: async () => {
		const result = await api.get("/categories/");
		return result.data.categories;
	},
};
