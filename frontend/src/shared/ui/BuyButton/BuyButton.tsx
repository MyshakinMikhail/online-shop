import { Button } from "antd";
import classes from "./BuyButton.module.css";

export default function BuyButton(props: React.ComponentProps<typeof Button>) {
	const handleClick = () => {
		console.log("Заказ оформлен!");
	};

	return (
		<Button
			className={classes.button}
			color="default"
			variant="solid"
			block
			size="large"
			onClick={handleClick}
			{...props}
		>
			Оформить заказ
		</Button>
	);
}
