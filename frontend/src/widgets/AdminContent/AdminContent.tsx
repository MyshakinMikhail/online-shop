import { Flex } from "antd";
import classes from "./AdminContent.module.css";
import { Orders, Products, Settings, Users } from "./AdminTabs";
import Promocodes from "./AdminTabs/Promocodes/Promocodes";

interface AdminContentProps {
	activeTab: string;
}

export default function AdminContent({ activeTab }: AdminContentProps) {
	const renderContent = () => {
		switch (activeTab) {
			case "products":
				return <Products />;
			case "promocodes":
				return <Promocodes />;
			case "orders":
				return <Orders />;
			case "users":
				return <Users />;
			case "settings":
				return <Settings />;
			default:
				return null;
		}
	};

	return <Flex className={classes.adminContent}>{renderContent()}</Flex>;
}
