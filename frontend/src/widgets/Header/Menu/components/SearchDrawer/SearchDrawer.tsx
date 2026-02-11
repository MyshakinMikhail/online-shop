import { SearchProductCard } from "@/entities/product/ui/cards";
import { useSearch } from "@/shared/hooks";
import { MenuIcon } from "@/shared/ui";
import { Drawer, Flex, Input, Typography } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";
import classes from "./SearchDrawer.module.css";

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
				<Flex className={classes.container} gap={15} justify="center">
					{content.length > 0 ? (
						sortedProducts.length > 0 ? (
							sortedProducts.map(product => (
								<SearchProductCard
									product={product}
									key={product.id}
									toggleDrawer={toggleDrawer}
								/>
							))
						) : (
							<Text>Товары не найдены</Text>
						)
					) : null}
				</Flex>
			</Drawer>
		</>
	);
}
