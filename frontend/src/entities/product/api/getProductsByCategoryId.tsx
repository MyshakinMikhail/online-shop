import { api } from "@/shared/api";
import type { Product } from "@/shared/types";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	categoryId: number | undefined;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setTotal: Dispatch<SetStateAction<number | undefined>>;
	setProducts: Dispatch<SetStateAction<Product[] | undefined>>;
	currPage: number;
	limit: number;
};

export const getProductsByCategoryId = async ({
	categoryId,
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
				categoryId: categoryId,
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
