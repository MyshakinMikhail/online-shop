import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import { mockCities } from "@/shared/mocks";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { MyButton } from "@/shared/ui";
import { Flex, Input, notification, Select, Typography } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Form.module.css";

const { Title } = Typography;

export const Form = () => {
	const [userName, setUserName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [promocode, setPromocode] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const navigate = useNavigate();

	const [alert, contextHolder] = notification.useNotification();
	const openFavoritesNotification = (placement: NotificationPlacement, error: string | null) => {
		if (!error) {
			alert.success({
				message: `Статус`,
				description: "Заказ успешно создан",
				placement,
				duration: 3,
			});
		} else {
			alert.error({
				message: `Статус`,
				description: `Ошибка создания заказа: ${error} `,
				placement,
				duration: 3,
			});
		}
	};

	const handleSendOrder = async () => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.post(`/order/${userInfo.id}`, {
				userName: userName,
				email: email,
				phoneNumber: phoneNumber,
				promocode: promocode,
				city: city,
			});
			openFavoritesNotification("top", null);
			setTimeout(() => {
				navigate("/");
			}, 3000);
		} catch (error) {
			if (isAxiosError(error)) {
				openFavoritesNotification("top", error.message);
				console.log(error);
			} else {
				console.error("Неизвестная ошибка при создании заказа");
			}
		}
	};

	return (
		<>
			{contextHolder}
			<Flex className={classes.form} vertical>
				<Flex vertical>
					<Title level={5}>Ваше имя</Title>
					<Input
						size="large"
						value={userName}
						onChange={e => setUserName(e.target.value)}
					/>
				</Flex>
				<Flex vertical>
					<Typography.Title level={5}>Почта</Typography.Title>
					<Input
						type="email"
						size="large"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</Flex>
				<Flex vertical>
					<Typography.Title level={5}>Телефон</Typography.Title>
					<Input
						type="tel"
						size="large"
						value={phoneNumber}
						onChange={e => setPhoneNumber(e.target.value)}
					/>
				</Flex>
				<Flex vertical>
					<Typography.Title level={5}></Typography.Title>
					<Flex gap={10}>
						<Input
							size="large"
							placeholder="Промокод"
							value={promocode}
							onChange={e => setPromocode(e.target.value)}
						/>
						<MyButton label="Активировать" />
					</Flex>
				</Flex>
				<Title level={5}>Доставка</Title>

				<Flex vertical style={{ marginBottom: "20px" }}>
					<Title level={5}>Город</Title>
					<Select
						options={mockCities}
						value={city}
						onChange={currCity => setCity(currCity)}
					/>
				</Flex>

				<MyButton label="Оформить" onClick={handleSendOrder} />
			</Flex>
		</>
	);
};
