import { FavoriteProductCard } from "@/entities/favorites/ui";
import { type RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import classes from "./ProductsList.module.css";
const { Paragraph } = Typography;

type Props = {
	toggleDrawer: () => void;
};

export default function FavoriteProductsList({ toggleDrawer }: Props) {
	const { favorites } = useSelector((state: RootState) => state.favoriteProducts);

	return (
		<>
			{favorites?.length === 0 ? <Paragraph>Товары не добавлены</Paragraph> : null}
			<Flex className={classes.products}>
				{favorites?.map((product: Product) => (
					<FavoriteProductCard
						key={product.article}
						product={product}
						toggleDrawer={toggleDrawer}
					/>
				))}
			</Flex>
		</>
	);
}
