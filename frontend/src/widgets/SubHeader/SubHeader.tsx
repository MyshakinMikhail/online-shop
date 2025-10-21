import { Flex, Typography } from "antd";
import classes from "./SubHeader.module.css";

const { Text } = Typography;

export default function SubHeader() {
	return (
		<Flex className={classes.subheader} justify="center" align="center">
			<Text className={classes.subheaderText}>SubHeader</Text>
		</Flex>
	);
}
