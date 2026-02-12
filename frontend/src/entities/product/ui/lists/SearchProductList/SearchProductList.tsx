import type { Product } from "@/shared/types";
import { Typography } from "antd";
import { SearchProductCard } from "../../cards";
import classes from "./SearchProductList.module.css";

const { Paragraph } = Typography;

type Props = {
	sortedProducts: Product[];
	toggleDrawer: () => void;
};

export default function SearchProductList({ sortedProducts, toggleDrawer }: Props) {
	const count = sortedProducts.length;

	return (
		<div className={classes.container}>
			<Paragraph>Товаров по запросу: {count}</Paragraph>
			<div className={classes.products}>
				{sortedProducts.length > 0 &&
					sortedProducts.map((product: Product) => (
						<SearchProductCard product={product} toggleDrawer={toggleDrawer} />
					))}
			</div>
		</div>
	);
}
