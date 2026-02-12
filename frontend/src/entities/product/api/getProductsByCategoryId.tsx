import { api } from "@/shared/api";
import type { Category } from "@/shared/types";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	category: Category | null;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setTotal: Dispatch<SetStateAction<number | undefined>>;
	currPage: number;
	limit: number;
};

export const getProductsByCategoryId = async ({
	category,
	setIsLoading,
	setError,
	setTotal,
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
		return result.data.rows;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error);
			setError(error.message);
		}
	} finally {
		setIsLoading(false);
	}
};
