import { useNotification } from "@/shared/hooks";

export function useProductNotifications() {
	const { contextHolder, showNotification } = useNotification();

	const showAddFavoriteProductNotification = () => {
		showNotification({
			status: "success",
			message: "Обновление избранных товаров",
			description: "Товар успешно добавлен в избранное",
			placement: "top",
			duration: 3,
		});
	};

	const showDeleteFavoriteProductNotification = () => {
		showNotification({
			status: "success",
			message: "Обновление избранных товаров",
			description: "Товар удален из избранного",
			placement: "top",
			duration: 3,
		});
	};

	const showUpdateCartNotification = (productName: string) => {
		showNotification({
			status: "success",
			message: "Обновление корзины",
			description: `"${productName}" добавлен в корзину`,
			placement: "top",
			duration: 3,
		});
	};

	return {
		contextHolder,
		showAddFavoriteProductNotification,
		showDeleteFavoriteProductNotification,
		showUpdateCartNotification,
	};
}
