import { useCategoryFromPath } from "@/shared/hooks";
import type { Category } from "@/shared/types";
import { Header } from "@/widgets/Header";
import { SubHeader } from "@/widgets/SubHeader";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	const category: Category = useCategoryFromPath();
	return (
		<>
			<Header />
			<SubHeader category={category} />
			<div>
				<Outlet />
			</div>
		</>
	);
}
