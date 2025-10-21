import { Outlet } from "react-router-dom";
import { useCategoryFromPath } from "../../../../shared/hooks";
import { Header } from "../../../../widgets/Header";
import { SubHeader } from "../../../../widgets/SubHeader";

export default function MainLayout() {
	const category = useCategoryFromPath();
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
