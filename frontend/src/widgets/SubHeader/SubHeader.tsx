import type { RootState } from "@/shared/lib/store";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import classes from "./SubHeader.module.css";

const { Text } = Typography;

export default function SubHeader() {
	const activeCategory = useSelector((state: RootState) => state.category.category);

	return (
		<Flex className={classes.subheader} justify="center" align="center">
			<Text className={classes.subheaderText}>
				{activeCategory?.name || "Категория не выбрана"}
			</Text>
		</Flex>
	);
}
