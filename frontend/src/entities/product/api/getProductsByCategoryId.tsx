import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { AppDispatch } from "@/shared/lib/store";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { getAllProducts } from "../model/getAllProducts";
import { updateProductsForPage } from "../model/productsPageSlice";

type Props = {
	categoryId: number | undefined;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setTotal: Dispatch<SetStateAction<number | undefined>>;
	dispatch: AppDispatch;
	currPage: number;
	limit: number;
};

export const getProductsByCategoryId = async ({
	categoryId,
	setIsLoading,
	setError,
	setTotal,
	dispatch,
	currPage,
	limit,
}: Props) => {
	try {
		setIsLoading(true);
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const result = await api.get(`/products/${userInfo.id}`, {
			params: {
				page: currPage,
				limit: limit,
				categoryId: categoryId,
			},
		});
		setTotal(result.data.count);
		dispatch(updateProductsForPage(result.data.products));
		dispatch(getAllProducts()); // получаю каждый раз при смене страницы, это плохо, но потом уберу !!!
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error);
			setError(error.message);
		}
	} finally {
		setIsLoading(false);
	}
};
