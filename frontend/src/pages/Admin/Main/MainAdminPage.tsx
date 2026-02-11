import { AdminContent, AdminHeader } from "@/widgets";
import { Flex } from "antd";
import { useState } from "react";
import classes from "./MainAdminPage.module.css";

export default function MainAdminPage() {
	const [activeTab, setActiveTab] = useState("1");

	return (
		<Flex vertical justify="center" align="center" className={classes.container}>
			<AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
			<AdminContent activeTab={activeTab} />
		</Flex>
	);
}
