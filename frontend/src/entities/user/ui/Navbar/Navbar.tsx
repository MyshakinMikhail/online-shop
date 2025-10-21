import { Flex, Typography } from "antd";
import { TextAlignJustify } from "lucide-react";
import classes from "./Navbar.module.css";

const { Title } = Typography;

export default function Navbar() {
	return (
		<Flex className={classes.navbar} gap={17} align="center">
			<TextAlignJustify />
			<Title level={2} style={{ margin: 0 }}>
				Магазин одежды
			</Title>
		</Flex>
	);
}
