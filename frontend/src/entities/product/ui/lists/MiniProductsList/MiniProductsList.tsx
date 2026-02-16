import type { CartItem } from "@/entities/cart/model/slice";
import type { RootState } from "@/shared/lib/store";
import type { ProductCardType } from "@/shared/types";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import MiniProductCard from "../../cards/MiniProductCard/MiniProductCard";
import classes from "./MiniProductsList.module.css";

const { Paragraph } = Typography;

type Props = {
	type: ProductCardType;
	toggleDrawer: () => void;
};

export default function MiniProductsList({ type, toggleDrawer }: Props) {
	// const [products, setProducts] = useState<Product[]>(mockMiniProducts);
	const items = useSelector((state: RootState) => state.cart);

	return (
		<>
			{items?.length === 0 ? <Paragraph>Товары не добавлены</Paragraph> : null}
			<Flex className={classes.products}>
				{items?.map((item: CartItem) => (
					<MiniProductCard
						key={item.id}
						product={item}
						type={type}
						toggleDrawer={toggleDrawer}
					/>
				))}
			</Flex>
		</>
	);
}
