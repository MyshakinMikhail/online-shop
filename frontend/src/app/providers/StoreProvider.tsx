// app/providers/StoreProvider.tsx
import { store } from "@/shared/lib/store";
import type { FC, ReactNode } from "react";
import { Provider } from "react-redux";

interface StoreProviderProps {
	children: ReactNode;
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};
