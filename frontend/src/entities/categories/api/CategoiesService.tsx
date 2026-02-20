import { api } from "@/shared/api";
import { isAxiosError } from "axios";

export const CategoriesServise = {
	getCategories: async () => {
		try {
			const result = await api.get("/categories/");
			return result.data.categories;
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					console.log(error.message);
				} else if (error.response?.status === 500) {
					console.log(error.message);
				}
			} else {
				console.error("Other API error:", error);
			}
		}
	},
};
