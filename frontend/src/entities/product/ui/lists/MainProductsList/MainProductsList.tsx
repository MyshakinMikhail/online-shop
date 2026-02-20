import type { RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { useSelector } from "react-redux";
import { MainProductCard } from "../../cards";
import classes from "./MainProductsList.module.css";

export default function MainProductsList() {
	const { items } = useSelector((state: RootState) => state.productsPage.productsForPage);

	return (
		<div className={classes.list}>
			{items?.length === 0 && <div>Товары отсутствуют</div>}
			{items?.map((product: Product) => (
				<MainProductCard key={product.article} product={product} />
			))}
		</div>
	);
}
