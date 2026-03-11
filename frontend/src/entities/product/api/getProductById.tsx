import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	id: number | null;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	showError: (errorMessage: string) => void;
};

export const getProductById = async ({ id, setIsLoading, showError }: Props) => {
	try {
		setIsLoading(true);
		if (!id) {
			showError("продукт не получен,id не передан");
			setIsLoading(false);
			return;
		}
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const result = await api.get(`/product/${userInfo.id}/${id}`);
		return result.data.product;
	} catch (error) {
		if (isAxiosError(error)) {
			showError(error.response?.data.message);
		}
	} finally {
		setIsLoading(false);
	}
};
