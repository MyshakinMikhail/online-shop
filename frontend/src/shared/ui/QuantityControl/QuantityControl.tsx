import { Flex } from "antd";

export function QuantityControl({
	count,
	increment,
	decrement,
}: {
	count: number;
	increment: () => void;
	decrement: () => void;
}) {
	return (
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
	);
}
