import type { Product } from "@/shared/types";
import { Typography } from "antd";
import { SearchProductCard } from "../../cards";

const { Paragraph } = Typography;

type Props = {
	sortedProducts: Product[];
};

export default function SearchProductList({ sortedProducts }: Props) {
	const count = sortedProducts.length;

	return (
		<div>
			<Paragraph>Товаров по запросу: {count}</Paragraph>
			{sortedProducts.length > 0 &&
				sortedProducts.map((product: Product) => (
					<SearchProductCard product={product} />
				))}
		</div>
	);
}
