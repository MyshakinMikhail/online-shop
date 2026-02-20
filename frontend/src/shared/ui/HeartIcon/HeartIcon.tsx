import { Avatar } from "antd";
import { Heart } from "lucide-react";
import classes from "./HeartIcon.module.css";

type Props = {
	isFavorite: boolean | undefined;
	onClick: () => void;
};

export default function HeartIcon({ isFavorite, onClick }: Props) {
	return (
		<Avatar
			onClick={onClick}
			icon={<Heart className={isFavorite ? classes.activeIcon : classes.icon} />}
			className={classes.avatar}
		/>
	);
}
