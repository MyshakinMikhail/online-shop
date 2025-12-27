import { Button, Flex, Tabs, Typography, type TabsProps } from "antd";
import classes from "./AdminHeader.module.css";

const { Text } = Typography;

interface AdminHeaderProps {
	activeTab: string;
	onTabChange: (key: string) => void;
}

export default function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
	const items: TabsProps["items"] = [
		{
			key: "1",
			label: "Все товары",
		},
		{
			key: "2",
			label: "Заказы",
		},
		{
			key: "3",
			label: "Пользователи",
		},
		{
			key: "4",
			label: "Настройки",
		},
	];

	return (
		<Flex className={classes.adminHeader}>
			<Text strong style={{ fontSize: "18px" }}>
				Admin панель
			</Text>
			<Tabs activeKey={activeTab} items={items} onChange={onTabChange} />
			<Flex>
				<Button>Выйти</Button>
			</Flex>
		</Flex>
	);
}
