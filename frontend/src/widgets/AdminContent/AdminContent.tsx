import { Flex } from "antd";
import classes from "./AdminContent.module.css";
import { Orders, Products, Settings, Users } from "./AdminTabs";

interface AdminContentProps {
	activeTab: string;
}

export default function AdminContent({ activeTab }: AdminContentProps) {
	const renderContent = () => {
		switch (activeTab) {
			case "1":
				return <Products />;
			case "2":
				return <Orders />;
			case "3":
				return <Users />;
			case "4":
				return <Settings />;
			default:
				return null;
		}
	};

	return <Flex className={classes.adminContent}>{renderContent()}</Flex>;
}
