import { Flex, Typography } from "antd";
import { getHeadersByCategory } from "../../shared/lib";
import classes from "./SubHeader.module.css";

const { Text } = Typography;

type Props = {
	category: string;
};

export default function SubHeader({ category }: Props) {
	return (
		<Flex className={classes.subheader} justify="center" align="center">
			<Text className={classes.subheaderText}>
				{getHeadersByCategory(category) || "Категория не выбрана"}
			</Text>
		</Flex>
	);
}
