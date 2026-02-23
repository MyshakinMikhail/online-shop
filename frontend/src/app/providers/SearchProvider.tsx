import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import { SearchContext } from "@/shared/context";
import type { Product } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { useEffect, useState, type ReactNode } from "react";

export const SearchProvider = ({ children }: { children: ReactNode }) => {
	const [content, setContent] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const userInfo: YandexUserInfo = storage.getUserInfo();
				if (content) {
					const response = await api.get(`/products/${userInfo.id}`, {
						params: {
							searchQuery: content,
						},
					});
					setProducts(response.data.products);
				}
			} catch (error) {
				console.error("Ошибка получения продуктов с сервера", error);
			}
		};

		fetchProducts();
	}, [content]);

	return (
		<SearchContext.Provider value={{ content, setContent, products }}>
			{children}
		</SearchContext.Provider>
	);
};
