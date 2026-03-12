import { useNotification } from "@/shared/hooks";

export function useUpdateProductNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showUpdatedProductNotification = () => {
		showNotification({
			status: "success",
			message: "Обновление товара",
			description: "Товар успешно обновлен на сервере",
			placement: "top",
			duration: 3,
		});
	};

	return { contextHolder, showUpdatedProductNotification };
}
