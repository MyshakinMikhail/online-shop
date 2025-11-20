import { mockMiniProducts } from "@/entities/product/model/mocks";
import { MainProductCard } from "../../cards";
import classes from "./MainProductsList.module.css";

export default function MainProductsList() {
	const products = mockMiniProducts;

	return (
		<div className={classes.list}>
			{products.length === 0 && <div>Товары отсутствуют</div>}
			{products.map((product) => (
				<MainProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
