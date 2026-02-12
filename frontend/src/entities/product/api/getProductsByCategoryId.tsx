import { api } from "@/shared/api";
import type { Category, Product } from "@/shared/types";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	category: Category | null;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setTotal: Dispatch<SetStateAction<number | undefined>>;
	setProducts: Dispatch<SetStateAction<Product[] | undefined>>;
	currPage: number;
	limit: number;
};

export const getProductsByCategoryId = async ({
	category,
	setIsLoading,
	setError,
	setTotal,
	setProducts,
	currPage,
	limit,
}: Props) => {
	try {
		setIsLoading(true);
		const result = await api.get("/products", {
			params: {
				page: currPage,
				limit: limit,
				categoryId: category?.id,
			},
		});
		setTotal(result.data.count);
		setProducts(result.data.rows);
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error);
			setError(error.message);
		}
	} finally {
		setIsLoading(false);
	}
};
