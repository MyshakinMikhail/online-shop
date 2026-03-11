import { type RootState } from "@/shared/lib/store";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import AdminProductCard from "../ProductCard/ProductCard";
import classes from "./ProductsList.module.css";

const { Text } = Typography;

export const AdminProductsList = () => {
	const { products } = useSelector((state: RootState) => state.adminProducts);
	return (
		<>
			{products.length === 0 ? (
				<Flex justify="center">
					<Text>Добавьте первый товар!</Text>
				</Flex>
			) : null}
			<Flex gap={20} justify="flex-start" align="center" className={classes.products}>
				{products.map(product => (
					<AdminProductCard key={product.id} product={product} />
				))}
			</Flex>
		</>
	);
};
