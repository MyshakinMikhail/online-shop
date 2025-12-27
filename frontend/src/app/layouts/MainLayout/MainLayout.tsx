import { useCategoryFromPath } from "@/shared/hooks";
import type { Category } from "@/shared/types";
import { Header } from "@/widgets/Header";
import { SubHeader } from "@/widgets/SubHeader";
import { Outlet } from "react-router-dom";
import classes from "./MainLayout.module.css";

export default function MainLayout() {
	const category: Category = useCategoryFromPath();
	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Header />
				<SubHeader category={category} />
			</div>
			<div className={classes.content}>
				<Outlet />
			</div>
		</div>
	);
}
