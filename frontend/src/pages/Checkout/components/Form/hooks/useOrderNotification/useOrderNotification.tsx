import { useNotification } from "@/shared/hooks";

export function useOrderNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showCreateOrderSuccessNotification = () => {
		showNotification({
			status: "success",
			message: "Статус",
			description: "Заказ успешно создан",
			placement: "top",
			duration: 3,
		});
	};

	const showCreateOrderErrorNotification = (error: string) => {
		showNotification({
			status: "error",
			message: "Статус",
			description: `Ошибка создания заказа: ${error}`,
			placement: "top",
			duration: 3,
		});
	};

	return {
		contextHolder,
		showCreateOrderErrorNotification,
		showCreateOrderSuccessNotification,
	};
}
