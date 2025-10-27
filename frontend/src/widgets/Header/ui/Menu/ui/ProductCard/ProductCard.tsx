import { Button, Col, Flex, Image, Row, Typography } from "antd";
import { CircleX } from "lucide-react";
import { useState } from "react";
import type { Product } from "./types/Product";

const { Text } = Typography;

type Props = {
	product: Product;
};

export default function ProductCard({ product }: Props) {
	const [count, setCount] = useState<number>(product.stock || 1);

	const decrement = () => {
		setCount((prev) => prev - 1);
	};
	const increment = () => {
		setCount((prev) => prev + 1);
	};

	return (
		<>
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
				<Col span={4}>
					<Flex gap={5} align="center">
						<img
							src="https://static.tildacdn.com/lib/linea/c8eecd27-9482-6c4f-7896-3eb09f6a1091/arrows_circle_minus.svg"
							style={{
								width: "12px",
								height: "12px",
								border: 0,
								color: "#5B5B5B",
							}}
							onClick={decrement}
						/>
						{count}
						<img
							src="https://static.tildacdn.com/lib/linea/c47d1e0c-6880-dc39-ae34-521197f7fba7/arrows_circle_plus.svg"
							style={{
								width: "12px",
								height: "12px",
								border: 0,
								color: "#5B5B5B",
							}}
							onClick={increment}
						/>
					</Flex>
				</Col>
				<Col span={4}>
					<Text>{product.price} руб.</Text>
				</Col>
				<Col span={2}>
					<Button type="link">
						<CircleX style={{ border: 0, color: "#5B5B5B" }} />
					</Button>
				</Col>
			</Row>
		</>
	);
}
