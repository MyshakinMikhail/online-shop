import { Avatar, Badge } from "antd";
import type { ComponentType } from "react";

type Props = {
	Icon: ComponentType<{ size: number; color: string }>;
	countNotifications?: number;
	// handleClick: () => void;
};

export default function MenuIcon({
	Icon,
	countNotifications,
}: // handleClick,
Props) {
	return (
		<Badge count={countNotifications} size="small">
			<Avatar
				style={{ backgroundColor: "white" }}
				icon={<Icon size={17} color="black" />}
				// onClick={handleClick}
			/>
		</Badge>
	);
}
