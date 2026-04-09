import { ScrollContext } from "@/shared/context/ScrollContext";
import { Header } from "@/widgets/Header";
import { SubHeader } from "@/widgets/SubHeader";
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import classes from "./MainLayout.module.css";

export default function MainLayout() {
	const contentRef = useRef<HTMLDivElement>(null);

	const scrollToTop = () => {
		contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Header />
				<SubHeader />
			</div>
			<div ref={contentRef} className={classes.content}>
				<ScrollContext.Provider value={{ scrollToTop }}>
					<Outlet />
				</ScrollContext.Provider>
			</div>
		</div>
	);
}
