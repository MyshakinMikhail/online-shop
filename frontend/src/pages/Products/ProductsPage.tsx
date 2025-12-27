import MainProductsList from "@/entities/product/ui/lists/MainProductsList/MainProductsList";
import classes from "./ProductsPage.module.css";

export default function ProductsPage() {
	return (
		<div className={classes.container}>
			<MainProductsList />
		</div>
	);
}
