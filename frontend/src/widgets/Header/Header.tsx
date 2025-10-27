import { Flex } from "antd";
import Menu from "./Menu/Menu";
import Navbar from "./Navbar/Navbar";

export default function Header() {
	return (
		<Flex justify="space-between">
			<Navbar />
			<Menu />
		</Flex>
	);
}
