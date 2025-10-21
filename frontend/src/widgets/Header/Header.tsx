import { Flex } from "antd";
import { Menu, Navbar } from "../../entities/user";

export default function Header() {
	return (
		<Flex justify="space-between">
			<Navbar />
			<Menu />
		</Flex>
	);
}
