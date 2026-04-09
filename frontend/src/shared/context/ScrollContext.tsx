import { createContext } from "react";

type ScrollContextType = {
	scrollToTop: () => void;
};

export const ScrollContext = createContext<ScrollContextType>({
	scrollToTop: () => {},
});
