import { adminTabs, defaultAdminTab } from "@/shared/consts/adminTabs";
import { AdminContent, AdminHeader } from "@/widgets";
import { Flex } from "antd";
import { useSearchParams } from "react-router-dom";
import classes from "./MainAdminPage.module.css";

const validTabIds = new Set(adminTabs.map(tab => tab.value));

export default function MainAdminPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	const tabFromUrl = searchParams.get("tab");
	const activeTab = tabFromUrl && validTabIds.has(tabFromUrl) ? tabFromUrl : defaultAdminTab;

	const handleTabChange = (value: string) => {
		setSearchParams(prev => {
			const next = new URLSearchParams(prev);
			next.set("tab", value);
			return next;
		});
	};

	return (
		<Flex vertical justify="center" align="center" className={classes.container}>
			<AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
			<AdminContent activeTab={activeTab} />
		</Flex>
	);
}
