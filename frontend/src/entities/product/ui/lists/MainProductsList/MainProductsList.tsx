import { type Product } from "@/shared/types";
import { MainProductCard } from "../../cards";
import classes from "./MainProductsList.module.css";

type Props = {
	products: Product[];
};

export default function MainProductsList({ products }: Props) {
	return (
		<div className={classes.list}>
			{products.length === 0 && <div>Товары отсутствуют</div>}
			{products.map(product => (
				<MainProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
