import { useNotification } from "@/shared/hooks";

export default function useFavoriteNotification() {
	const { contextHolder, showNotification } = useNotification();

	const showAddFavoriteProductNotification = () => {
		showNotification({
			status: "success",
			message: "Информация о статусе товара",
			description: "Товар успешно добавлен в избранное",
			placement: "top",
			duration: 3,
		});
	};

	const showDeleteFavoriteProductNotification = () => {
		showNotification({
			status: "success",
			message: "Информация о статусе товара",
			description: "Товар успешно удален из избранного",
			placement: "top",
			duration: 3,
		});
	};

	return {
		contextHolder,
		showAddFavoriteProductNotification,
		showDeleteFavoriteProductNotification,
	};
}
