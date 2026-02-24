import { Avatar, Divider, Flex } from "antd";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

export default function Header() {
	const navigate = useNavigate();
	return (
		<>
			<Flex className={classes.header}>
				<div></div>
				<p className={classes.text}>Ваш заказ</p>
				<Avatar className={classes.icon} icon={<X />} onClick={() => navigate("/")} />
			</Flex>
			<Divider size="small" />
		</>
	);
}
