import { Outlet, useParams } from "react-router-dom";
import { Header } from "../../../../widgets/Header";
import SubHeader from "./../../../../widgets/SubHeader/SubHeader";

export default function MainLayout() {
	const { category } = useParams<{ category: string }>();
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
