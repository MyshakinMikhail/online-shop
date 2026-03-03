import type { Product } from "@/shared/types";
import { Avatar, Flex, Typography } from "antd";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

type Props = {
	product?: Product | null;
};

const { Text } = Typography;

export const Header = ({ product }: Props) => {
	const navigate = useNavigate();
	return (
		<Flex className={classes.header}>
			<div></div>
			<Text className={classes.headerText}>
				{product ? `Редактирование товара ${product.name}` : "Создание нового товара"}
			</Text>
			<Avatar className={classes.icon} icon={<X />} onClick={() => navigate("/admin/main")} />
		</Flex>
	);
};
