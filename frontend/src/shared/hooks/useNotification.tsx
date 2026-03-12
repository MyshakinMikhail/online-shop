import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { useCallback } from "react";

type ShowNotificationProps = {
	status: "success" | "error";
	message: string;
	description: React.ReactNode;
	placement: NotificationPlacement;
	duration: number;
};

export function useNotification() {
	const [api, contextHolder] = notification.useNotification();

	const showError = useCallback(
		(
			message: string,
			description: React.ReactNode,
			placement: NotificationPlacement,
			duration: number
		) => {
			api.error({
				message,
				description,
				placement,
				duration,
			});
		},
		[api]
	);

	const showSuccess = useCallback(
		(
			message: string,
			description: React.ReactNode,
			placement: NotificationPlacement,
			duration: number
		) => {
			api.success({
				message,
				description,
				placement,
				duration,
			});
		},
		[api]
	);

	const showNotification = useCallback(
		({ status, message, description, placement, duration }: ShowNotificationProps) => {
			if (status === "error") {
				showError(message, description, placement, duration);
			} else {
				showSuccess(message, description, placement, duration);
			}
		},
		[showError, showSuccess]
	);

	return { api, contextHolder, showNotification };
}
