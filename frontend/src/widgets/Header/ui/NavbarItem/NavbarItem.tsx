import { Typography } from "antd";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

type Props = {
	children: ReactNode;
	isUnderline: boolean;
	path: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NavbarItem({
	children,
	isUnderline,
	path,
	setOpen,
}: Props) {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(path);
		setOpen(false);
	};

	return (
		<Text
			underline={isUnderline}
			style={{ cursor: "pointer" }}
			onClick={handleClick}
		>
			{children}
		</Text>
	);
}
