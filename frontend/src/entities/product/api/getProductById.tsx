import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	id: number | null;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
};

export const getProductById = async ({ id, setIsLoading, setError }: Props) => {
	try {
		setIsLoading(true);
		if (!id) {
			setError("продукт не получен,id не передан");
			setIsLoading(false);
			return;
		}
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const result = await api.get(`/product/${userInfo.id}/${id}`);
		return result.data.product;
	} catch (error) {
		if (isAxiosError(error)) {
			setError(error.response?.data.message);
		}
	} finally {
		setIsLoading(false);
	}
};
