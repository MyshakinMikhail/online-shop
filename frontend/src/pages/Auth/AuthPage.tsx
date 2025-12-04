import {
    exchangeCodeForToken,
    getUserInfo,
    initiateYandexAuth,
} from "@/shared/lib/yandexAuth";
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

	const handleAuthCallback = useCallback(async (code: string) => {
		setLoading(true);
		setError(null);

		try {
			const tokenData = await exchangeCodeForToken(code);
			const userInfo = await getUserInfo(tokenData.access_token);

			localStorage.setItem("yandex_access_token", tokenData.access_token);
			if (tokenData.refresh_token) {
				localStorage.setItem("yandex_refresh_token", tokenData.refresh_token);
			}
			localStorage.setItem("user_info", JSON.stringify(userInfo));

			setSuccess(true);

			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (err) {
			const errorMessage = err instanceof Error
				? err.message
				: "Произошла ошибка при авторизации";
			setError(errorMessage);
			setLoading(false);
		}
	}, [navigate]);

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

	const handleYandexLogin = () => {
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

