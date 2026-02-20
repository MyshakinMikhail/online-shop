import type { CartItem } from "@/entities/cart/model/slice";
import type { RootState } from "@/shared/lib/store";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import classes from "./ProductsList.module.css";
import CartProductCard from "../card/ProductCard";

const { Paragraph } = Typography;

type Props = {
	toggleDrawer: () => void;
};

export default function CartProductsList({ toggleDrawer }: Props) {
	// const [products, setProducts] = useState<Product[]>(mockMiniProducts);
	const items = useSelector((state: RootState) => state.cart);

	return (
		<>
			{items?.length === 0 ? <Paragraph>Товары не добавлены</Paragraph> : null}
			<Flex className={classes.products}>
				{items?.map((item: CartItem) => (
					<CartProductCard key={item.id} product={item} toggleDrawer={toggleDrawer} />
				))}
			</Flex>
		</>
	);
}
