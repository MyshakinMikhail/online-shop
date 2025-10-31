import { Avatar, Badge } from "antd";
import type { ComponentType } from "react";

type Props = {
	Icon: ComponentType<{ size: number; color: string }>;
	countNotifications?: number;
	onClick?: () => void; // временно необязательный
};

export default function MenuIcon({ Icon, countNotifications, onClick }: Props) {
	return (
		<Badge count={countNotifications} size="small">
			<Avatar
				style={{
					backgroundColor: "white",
					boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
					cursor: onClick ? "pointer" : "default",
				}}
				icon={<Icon size={17} color="black" />}
				onClick={onClick}
			/>
		</Badge>
	);
}
