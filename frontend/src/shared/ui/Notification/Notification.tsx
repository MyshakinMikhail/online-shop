// import { Button, Flex, notification, Typography } from "antd";
// import type { NotificationPlacement } from "antd/es/notification/interface";
// import classes from "./Notification.module.css";

// type Props = {
// 	status: "success" | "error";
// 	placement: NotificationPlacement;
// 	message: string;
// };

// const { Text } = Typography;

// export default function Notification({}) {
// 	const [api, contextHolder] = notification.useNotification();

// 	const showError = () => {
// 		api.error({
// 			message: "Вы уверены, что хотите удалить товар?",
// 			description: (
// 				<Flex className={classes.alert}>
// 					<Text className={classes.alertText}>
// 						Данное действие нельзя будет отменить!
// 					</Text>
// 					<Button variant="solid" color="danger" onClick={handleDelete}>
// 						Удалить товар {product.name}
// 					</Button>
// 				</Flex>
// 			),
// 			placement: "top",
// 			duration: 60,
// 		});
// 	};

// 	const showSuccess = (placement: NotificationPlacement, newStatus: boolean) => {
// 		api.success({
// 			message: `Уведомление о статусе товара`,
// 			description: newStatus
// 				? "Товар успешно добавлен в избранное"
// 				: "Товар удален из избранного",
// 			placement,
// 			duration: 3,
// 		});
// 	};
// }
