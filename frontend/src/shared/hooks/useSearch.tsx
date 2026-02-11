import { useContext } from "react";
import { SearchContext } from "../context";

export const useSearch = () => {
	const context = useContext(SearchContext);
	if (!context) {
		throw new Error("useSearch must be used within SearchDrawerProvider");
	}
	return context;
};
