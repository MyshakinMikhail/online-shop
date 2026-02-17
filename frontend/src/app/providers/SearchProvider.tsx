import { api } from "@/shared/api";
import { SearchContext } from "@/shared/context";
import type { Product } from "@/shared/types";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const SearchProvider = ({ children }: { children: ReactNode }) => {
	const [content, setContent] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await api.get("/products/", {
					params: {
						page: 0,
						limit: 10000,
						categoryId: 1,
					},
				});

				setProducts(response.data.rows);
			} catch (error) {
				console.error("Ошибка получения продуктов с сервера", error);
			}
		};

		fetchProducts();
	}, []);

	const sortedProducts = useMemo(() => {
		if (!content.trim()) {
			return [];
		}

		const query = content.toLowerCase().trim();

		return products.filter(product => {
			const nameMatch = product.name?.toLowerCase().includes(query);
			return nameMatch;
		});
	}, [content]);

	return (
		<SearchContext.Provider value={{ content, setContent, sortedProducts }}>
			{children}
		</SearchContext.Provider>
	);
};
