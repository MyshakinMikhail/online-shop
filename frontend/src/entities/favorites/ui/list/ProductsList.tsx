import { FavoriteProductCard } from "@/entities/favorites/ui";
import type { RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import classes from "./ProductsList.module.css";
const { Paragraph } = Typography;

type Props = {
	toggleDrawer: () => void;
};

export default function FavoriteProductsList({ toggleDrawer }: Props) {
	const { items } = useSelector((state: RootState) => state.productsPage.allProducts);
	const favoriteItems = items.filter(item => item.isFavorite === true);

	return (
		<>
			{favoriteItems?.length === 0 ? <Paragraph>Товары не добавлены</Paragraph> : null}
			<Flex className={classes.products}>
				{favoriteItems?.map(
					(product: Product) =>
						product.isFavorite && (
							<FavoriteProductCard
								key={product.article}
								product={product}
								toggleDrawer={toggleDrawer}
							/>
						)
				)}
			</Flex>
		</>
	);
}
