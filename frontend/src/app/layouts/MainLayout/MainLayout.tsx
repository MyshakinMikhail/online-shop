import { Header } from "@/widgets/Header";
import { SubHeader } from "@/widgets/SubHeader";
import { Outlet } from "react-router-dom";
import classes from "./MainLayout.module.css";

export default function MainLayout() {
	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Header />
				<SubHeader />
			</div>
			<div className={classes.content}>
				<Outlet />
			</div>
		</div>
	);
}
