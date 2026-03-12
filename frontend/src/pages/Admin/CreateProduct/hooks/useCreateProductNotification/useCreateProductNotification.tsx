import { useNotification } from "@/shared/hooks";

export function useCreateProductNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showCreatedProductNotification = () => {
		showNotification({
			status: "success",
			message: "Статус товара",
			description: "Товар успешно добавлен на сервер",
			placement: "top",
			duration: 3,
		});
	};

	return { contextHolder, showCreatedProductNotification };
}
