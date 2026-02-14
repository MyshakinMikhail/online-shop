import { SearchContext } from "@/shared/context";
import type { RootState } from "@/shared/lib/store";
import { useMemo, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";

export const SearchProvider = ({ children }: { children: ReactNode }) => {
	const [content, setContent] = useState<string>("");
	const products = useSelector((state: RootState) => state.products);

	const sortedProducts = useMemo(() => {
		if (!content.trim()) {
			return [];
		}

		const query = content.toLowerCase().trim();

		return products.filter(product => {
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
