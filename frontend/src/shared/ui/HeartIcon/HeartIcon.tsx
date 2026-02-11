import { Avatar } from "antd";
import { Heart } from "lucide-react";
import classes from "./HeartIcon.module.css";

export default function HeartIcon() {
	const handleClick = () => {
		console.log("Илья лох");
	};

	return (
		<Avatar
			onClick={handleClick}
			icon={<Heart className={classes.icon} />}
			className={classes.avatar}
		/>
	);
}
