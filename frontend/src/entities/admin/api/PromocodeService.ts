import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { Promocode } from "@/shared/types";
import type { CreationPromocode } from "@/shared/types/promocode";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

export const PromocodeService = {
	addPromocode: async (promocode: CreationPromocode) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const response = await api.post(`/promocode/${userInfo.id}`, { ...promocode });
		return response.data.promocode;
	},

	updatePromocode: async (promocode: Promocode) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.put(`/promocode/${userInfo.id}`, { ...promocode });
	},

	deletePromocode: async (promocodeName: string) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.delete(`/promocode/${userInfo.id}`, {
			params: { name: promocodeName },
		});
	},
};
