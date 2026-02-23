import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Product } from "../types";

type SearchContextType = {
	content: string;
	setContent: Dispatch<SetStateAction<string>>;
	products: Product[];
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);
