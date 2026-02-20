import { CategoriesServise } from "@/entities/categories/api/CategoiesService";
import { changeCategory } from "@/entities/categories/model/slice";
import type { RootState } from "@/shared/lib/store";
import type { Category } from "@/shared/types";
import { Drawer, Flex, Typography } from "antd";
import { TextAlignJustify } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import NavbarItem from "./components/NavbarItem";

const { Title } = Typography;

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const activeCategory = useSelector((state: RootState) => state.category.category);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await CategoriesServise.getCategories();
				setCategories(data);
			} catch (error) {
				console.error("Ошибка загрузки категорий:", error);
			}
		};

		fetchCategories();
	}, []);

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
				<TextAlignJustify onClick={showDrawer} className={classes.icon} />
				<Title
					level={2}
					style={{ margin: 0 }}
					className={classes.title}
					onClick={() => {
						navigate("/all");
						dispatch(
							changeCategory({
								category: { id: 1, name: "Все товары", slug: "all" },
								loading: false,
								error: null,
							})
						);
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
				<Flex vertical className={classes.navbarItems} gap={12}>
					{categories.map(category => {
						const path = "/" + category.slug;
						return (
							<NavbarItem
								key={category.id} // Добавляем key
								isUnderline={activeCategory?.id === category.id} // Безопасное обращение
								path={path}
								setOpen={setOpen}
								category={category}
							>
								{category.name}
							</NavbarItem>
						);
					})}
				</Flex>
			</Drawer>
		</>
	);
}
