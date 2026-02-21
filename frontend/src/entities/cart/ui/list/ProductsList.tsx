import type { CartItem } from "@/entities/cart/model/slice";
import type { RootState } from "@/shared/lib/store";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import CartProductCard from "../card/ProductCard";
import classes from "./ProductsList.module.css";

const { Paragraph } = Typography;

type Props = {
	toggleDrawer: () => void;
};

export default function CartProductsList({ toggleDrawer }: Props) {
	// const [products, setProducts] = useState<Product[]>(mockMiniProducts);
	const { products } = useSelector((state: RootState) => state.cart);

	return (
		<>
			{products?.length === 0 ? <Paragraph>Товары не добавлены</Paragraph> : null}
			<Flex className={classes.products}>
				{products?.map((item: CartItem) => (
					<CartProductCard key={item.id} product={item} toggleDrawer={toggleDrawer} />
				))}
			</Flex>
		</>
	);
}

// победа!!!
