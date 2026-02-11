import { mockMiniProducts } from "@/entities/product/model/mocks";
import { SearchContext } from "@/shared/context";
import { useMemo, useState, type ReactNode } from "react";

export const SearchProvider = ({ children }: { children: ReactNode }) => {
	const [content, setContent] = useState<string>("");

	const sortedProducts = useMemo(() => {
		if (!content.trim()) {
			return [];
		}

		const query = content.toLowerCase().trim();

		return mockMiniProducts.filter(product => {
			const titleMatch = product.name?.toLowerCase().includes(query);
			const descriptionMatch = product.description?.toLowerCase().includes(query);
			return titleMatch || descriptionMatch;
		});
	}, [content]);

	return (
		<SearchContext.Provider value={{ content, setContent, sortedProducts }}>
			{children}
		</SearchContext.Provider>
	);
};
