import { Drawer, Flex, Typography } from "antd";
import { TextAlignJustify } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarItem from "../NavbarItem/NavbarItem";
import classes from "./Navbar.module.css";

const { Title } = Typography;

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Flex className={classes.navbar} gap={17} align="center">
				<TextAlignJustify
					onClick={showDrawer}
					className={classes.icon}
				/>
				<Title
					level={2}
					style={{ margin: 0 }}
					className={classes.title}
					onClick={() => {
						navigate("/all");
					}}
				>
					Магазин Одежды
				</Title>
			</Flex>

			<Drawer
				title="Выбор ассортимента"
				placement={"left"}
				width={310}
				onClose={onClose}
				open={open}
			>
				<Flex className={classes.navbarItems}>
					<NavbarItem isUnderline={true} path="/all" setOpen={setOpen}>
						Все товары
					</NavbarItem>
					<NavbarItem isUnderline={false} path="/tShirts" setOpen={setOpen}>
						Футболки
					</NavbarItem>
					<NavbarItem isUnderline={false} path="/hoodies" setOpen={setOpen}>
						Худи
					</NavbarItem>
					<NavbarItem isUnderline={false} path="/longSleeves" setOpen={setOpen}>
						Лонгсливы
					</NavbarItem>
					<NavbarItem isUnderline={false} path="/trousers" setOpen={setOpen}>
						Штаны
					</NavbarItem>
				</Flex>
			</Drawer>
		</>
	);
}
