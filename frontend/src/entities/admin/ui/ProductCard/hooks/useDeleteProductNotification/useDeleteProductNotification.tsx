import { useNotification } from "@/shared/hooks";
import { Button, Flex, Typography } from "antd";
import classes from "./useDeleteProductNotification.module.css";

const { Text } = Typography;

type ShowDeleteConfirmProps = {
	handleDelete: () => void;
	productName: string;
};

export function useDeleteProductNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showDeleteProductConfirm = ({ handleDelete, productName }: ShowDeleteConfirmProps) => {
		showNotification({
			status: "error",
			message: "Вы уверены, что хотите удалить товар?",
			description: (
				<Flex className={classes.alert}>
					<Text className={classes.alertText}>
						Данное действие нельзя будет отменить!
					</Text>
					<Button variant="solid" color="danger" onClick={handleDelete}>
						Удалить товар {productName}
					</Button>
				</Flex>
			),
			placement: "top",
			duration: 60,
		});
	};

	return { contextHolder, showDeleteProductConfirm };
}
