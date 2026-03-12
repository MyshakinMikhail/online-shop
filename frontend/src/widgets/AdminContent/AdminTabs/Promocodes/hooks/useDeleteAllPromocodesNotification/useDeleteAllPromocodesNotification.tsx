import { useNotification } from "@/shared/hooks";
import { Button, Flex, Typography } from "antd";
import classes from "../../Promocodes.module.css";

const { Text } = Typography;

type ShowDeleteAllPromocodesConfirmProps = {
	handleDeleteAllPromocodes: () => void;
};

export function useDeleteAllPromocodesNotification() {
	const { api, contextHolder, showNotification } = useNotification();

	const hideDeleteAllPromocodesConfirm = () => {
		api.destroy();
	};

	const showDeleteAllPromocodesConfirm = ({
		handleDeleteAllPromocodes,
	}: ShowDeleteAllPromocodesConfirmProps) => {
		showNotification({
			status: "error",
			message: "Вы уверены, что хотите удалить все промокоды?",
			description: (
				<Flex className={classes.alert}>
					<Text className={classes.alertText}>
						Данное действие нельзя будет отменить!
					</Text>
					<Button variant="solid" color="danger" onClick={handleDeleteAllPromocodes}>
						Удалить все промокоды
					</Button>
				</Flex>
			),
			placement: "top",
			duration: 60,
		});
	};

	return {
		contextHolder,
		hideDeleteAllPromocodesConfirm,
		showDeleteAllPromocodesConfirm,
	};
}
