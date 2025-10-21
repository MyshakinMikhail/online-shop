import { Flex, Typography } from "antd";
import { PRODUCT_HEADERS } from "../../shared/consts";
import classes from "./SubHeader.module.css";

const { Text } = Typography;

type Props = {
	category: string | undefined;
};

export default function SubHeader({ category }: Props) {
	return (
		<Flex className={classes.subheader} justify="center" align="center">
			<Text className={classes.subheaderText}>
				{category ? PRODUCT_HEADERS[category] : "Категория не выбрана"}
			</Text>
		</Flex>
	);
}
