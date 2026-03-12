import { useNotification } from "@/shared/hooks";

export function usePromocodeNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showPromocodeErrorNotification = (errorMessage: string) => {
		showNotification({
			status: "error",
			message: "Ошибка добавления/обновления промокода",
			description: errorMessage,
			placement: "top",
			duration: 3,
		});
	};

	const showPromocodeSuccessNotification = (successMessage: string) => {
		showNotification({
			status: "success",
			message: "Промокод успешно добавлен/обновлен",
			description: successMessage,
			placement: "top",
			duration: 3,
		});
	};

	return {
		contextHolder,
		showPromocodeErrorNotification,
		showPromocodeSuccessNotification,
	};
}
