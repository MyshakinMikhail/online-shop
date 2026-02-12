import { api } from "@/shared/api";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	id: number | null;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
};

export const getProductsById = async ({ id, setIsLoading, setError }: Props) => {
	try {
		setIsLoading(true);
		if (!id) {
			setError("id не передан");
			setIsLoading(false);
			return;
		}
		const result = await api.get(`/products/${id}`);
		return result.data.product;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message);
			setError(error.message);
		}
	} finally {
		setIsLoading(false);
	}
};
