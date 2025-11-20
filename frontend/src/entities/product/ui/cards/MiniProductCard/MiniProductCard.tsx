import type { Product, ProductCardType } from "@/shared/types";
import { QuantityControl } from "@/shared/ui";
import { Button, Col, Flex, Image, Row, Typography } from "antd";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

type Props = {
	product: Product;
	type: ProductCardType;
	handleDelete: (id: string) => void;
	toggleDrawer: () => void;
};

export default function MiniProductCard({
	product,
	type,
	handleDelete,
	toggleDrawer,
}: Props) {
	const [count, setCount] = useState<number>(product.stock || 1);
	const navigate = useNavigate();

	const decrement = () => {
		setCount((prev) => prev - 1);
	};
	const increment = () => {
		setCount((prev) => prev + 1);
	};

	return (
		<div
			onClick={() => {
				navigate(`/products/${product.id}`);
				toggleDrawer();
			}}
		>
			<Row align="middle" justify="space-evenly">
				<Col span={4}>
					<Image
						src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
						width={60}
						height="auto"
						style={{ borderRadius: "10px" }}
					/>
				</Col>
				<Col span={10}>
					<Flex>
						{product.description}
						{product.size}
						{product.article}
					</Flex>
				</Col>
				{type === "cart" && (
					<Col span={4}>
						<QuantityControl
							count={count}
							increment={increment}
							decrement={decrement}
						/>
					</Col>
				)}
				<Col span={4}>
					<Text>{product.price} руб.</Text>
				</Col>
				<Col span={2}>
					<Button
						type="link"
						onClick={(e) => {
							e.stopPropagation();
							handleDelete(product.id);
						}}
					>
						<CircleX style={{ border: 0, color: "#5B5B5B" }} />
					</Button>
				</Col>
			</Row>
		</div>
	);
}
