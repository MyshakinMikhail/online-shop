import { MenuIcon } from "@/shared/ui";
import { Drawer, Input } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchDrawer() {
	const [open, setOpen] = useState<boolean>(false);
	const [input, setInput] = useState<string>("");

	const toggleDrawer = () => {
		setOpen((open) => !open);
	};

	return (
		<>
			<MenuIcon Icon={Search} onClick={toggleDrawer} />
			<Drawer
				title="Поиск товаров"
				height={150}
				placement="top"
				open={open}
				onClose={toggleDrawer}
				styles={{ mask: { backgroundColor: "transparent" } }}
			>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Введите название товара"
					prefix={<Search />}
					allowClear
					onClear={() => {
						setInput("");
					}}
				/>
			</Drawer>
		</>
	);
}
