import { api } from "@/shared/api";
import { exchangeCodeForToken, getUserInfo, initiateYandexAuth } from "@/shared/lib/yandexAuth";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { Alert, Button, Card, Space, Typography } from "antd";
import { LogIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AuthPage.module.css";

const { Title, Text } = Typography;

export default function AuthPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleAuthCallback = useCallback(
		async (code: string) => {
			setLoading(true);
			setError(null);

			try {
				// 1. Получаем токен и данные от Яндекс
				const tokenData = await exchangeCodeForToken(code);
				const userInfo: YandexUserInfo = await getUserInfo(tokenData.access_token);

				// 2. Сохраняем токены
				localStorage.setItem("yandex_access_token", tokenData.access_token);
				if (tokenData.refresh_token) {
					localStorage.setItem("yandex_refresh_token", tokenData.refresh_token);
				}
				localStorage.setItem("user_info", JSON.stringify(userInfo));

				// 3. Отправляем данные на наш сервер для создания/обновления
				const response = await api.post("/auth/yandex", {
					user: {
						role: "user",
						psuid: userInfo.id,
						first_name: userInfo.first_name,
						last_name: userInfo.last_name,
						sex: userInfo.sex,
						default_email: userInfo.default_email,
						is_buying_smth: false,
					},
				});

				if (response.status === 200 || response.status === 201) {
					// Успешно создан/обновлен
					setSuccess(true);

					// Редирект на главную через секунду
					setTimeout(() => navigate("/"), 1000);
				} else {
					throw new Error(`Unexpected status: ${response.status}`);
				}
			} catch (err) {
				console.error("Auth error:", err);
				const errorMessage = "Произошла ошибка при авторизации";
				setError(errorMessage);

				// Очищаем данные при ошибке
				localStorage.removeItem("user_info");
				localStorage.removeItem("yandex_access_token");
			} finally {
				setLoading(false);
			}
		},
		[navigate]
	);

	useEffect(() => {
		const code = searchParams.get("code");
		const errorParam = searchParams.get("error");

		if (errorParam) {
			setError(`Ошибка авторизации: ${errorParam}`);
			return;
		}

		if (code) {
			handleAuthCallback(code);
		}
	}, [searchParams, handleAuthCallback]);

	const handleYandexLogin = async () => {
		setError(null);
		initiateYandexAuth();
	};

	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<Space direction="vertical" size="large" align="center" style={{ width: "100%" }}>
					<LogIn size={48} className={styles.icon} />
					<Title level={2} style={{ margin: 0, textAlign: "center" }}>
						Вход в аккаунт
					</Title>
					<Text type="secondary" style={{ textAlign: "center", display: "block" }}>
						Войдите с помощью Яндекс ID для доступа к вашему профилю
					</Text>

					{error && (
						<Alert
							message="Ошибка"
							description={error}
							type="error"
							showIcon
							style={{ width: "100%" }}
						/>
					)}

					{success && (
						<Alert
							message="Успешно!"
							description="Авторизация прошла успешно. Перенаправляем..."
							type="success"
							showIcon
							style={{ width: "100%" }}
						/>
					)}

					<Button
						type="primary"
						size="large"
						onClick={handleYandexLogin}
						loading={loading}
						disabled={loading || success}
						style={{ minWidth: 200 }}
					>
						Войти через Яндекс ID
					</Button>
				</Space>
			</Card>
		</div>
	);
}
