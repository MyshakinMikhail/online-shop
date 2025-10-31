import type { ButtonProps } from "antd";
import { Button } from "antd";
import classes from "./MyButton.module.css";

type Props = ButtonProps & {
	label?: string; // текст кнопки по умолчанию
};

export default function MyButton({
	label = "Купить",
	onClick,
	...props
}: Props) {
	return (
		<>
			<Button
				className={classes.button}
				color="default"
				variant="solid"
				block
				size="large"
				onClick={onClick}
				{...props}
			>
				{label}
			</Button>
		</>
	);
}
