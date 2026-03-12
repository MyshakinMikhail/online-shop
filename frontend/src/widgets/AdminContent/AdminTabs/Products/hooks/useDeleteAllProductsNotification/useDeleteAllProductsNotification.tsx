import { useNotification } from "@/shared/hooks";
import { Button, Flex, Typography } from "antd";
import classes from "../../Products.module.css";

const { Text } = Typography;

type ShowDeleteAllProductsConfirmProps = {
	handleDeleteAllProducts: () => void;
};

export function useDeleteAllProductsNotification() {
	const { api, contextHolder, showNotification } = useNotification();

	const hideDeleteAllProductsConfirm = () => {
		api.destroy();
	};

	const showDeleteAllProductsConfirm = ({
		handleDeleteAllProducts,
	}: ShowDeleteAllProductsConfirmProps) => {
		showNotification({
			status: "error",
			message: "Вы уверены, что хотите удалить все товары?",
			description: (
				<Flex className={classes.alert}>
					<Text className={classes.alertText}>
						Данное действие нельзя будет отменить!
					</Text>
					<Button variant="solid" color="danger" onClick={handleDeleteAllProducts}>
						Удалить все товары
					</Button>
				</Flex>
			),
			placement: "top",
			duration: 60,
		});
	};

	return { contextHolder, hideDeleteAllProductsConfirm, showDeleteAllProductsConfirm };
}
