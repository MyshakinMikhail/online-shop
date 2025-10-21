import { Flex } from "antd";
import { Menu, Navbar } from "./ui";

export default function Header() {
	return (
		<Flex justify="space-between">
			<Navbar />
			<Menu />
		</Flex>
	);
}
