import SearchProductList from "@/entities/product/ui/lists/SearchProductList/SearchProductList";
import { useSearch } from "@/shared/hooks";
import { MenuIcon } from "@/shared/ui";
import { Drawer, Input, Typography } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

const { Text } = Typography;

export default function SearchDrawer() {
	const [open, setOpen] = useState<boolean>(false);
	const { content, setContent, sortedProducts } = useSearch();

	const toggleDrawer = () => {
		setOpen(open => !open);
	};

	const drawerHeight = sortedProducts.length > 0 ? "100dvh" : 175;

	return (
		<>
			<MenuIcon Icon={Search} onClick={toggleDrawer} />
			<Drawer
				title="Поиск товаров"
				height={drawerHeight}
				placement="top"
				open={open}
				onClose={toggleDrawer}
				styles={{ mask: { backgroundColor: "transparent" } }}
			>
				<Input
					value={content}
					onChange={e => setContent(e.target.value)}
					placeholder="Введите название товара"
					prefix={<Search />}
					allowClear
					onClear={() => {
						setContent("");
					}}
				/>
				<div>
					{content.length > 0 ? (
						sortedProducts.length > 0 ? (
							<SearchProductList
								sortedProducts={sortedProducts}
								toggleDrawer={toggleDrawer}
							/>
						) : (
							<Text>Товары не найдены</Text>
						)
					) : null}
				</div>
			</Drawer>
		</>
	);
}
