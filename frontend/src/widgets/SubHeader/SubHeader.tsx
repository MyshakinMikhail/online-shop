import getCategoryRuByCategory from "@/shared/lib/getHeaderByCategory";
import type { Category } from "@/shared/types";
import { Flex, Typography } from "antd";
import classes from "./SubHeader.module.css";

const { Text } = Typography;

type Props = {
	category: Category;
};

export default function SubHeader({ category }: Props) {
	return (
		<Flex className={classes.subheader} justify="center" align="center">
			<Text className={classes.subheaderText}>
				{getCategoryRuByCategory(category) || "Категория не выбрана"}
			</Text>
		</Flex>
	);
}
