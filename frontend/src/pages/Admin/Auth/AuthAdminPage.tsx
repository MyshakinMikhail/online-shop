import { api } from "@/shared/api";
import { Alert, Button, Card, Input, Space, Typography } from "antd";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthAdminPage.module.css";

const { Title, Text } = Typography;

export default function AuthAdminPage() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [login, setLogin] = useState("");
	const navigate = useNavigate();

	const handleAdminLogin = async () => {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response = await api.post("/admin/login", {
				login,
				password,
			});
			if (response.status === 200) {
				setSuccess(true);
				navigate("/admin/main", { replace: true });
			}
		} catch (e) {
			setError("Неверный логин или пароль");
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<Space
					direction="vertical"
					size="large"
					align="center"
					style={{ width: "100%" }}
				>
					<LogIn size={48} className={styles.icon} />
					<Title level={2} style={{ margin: 0, textAlign: "center" }}>
						Вход в аккаунт администратора
					</Title>
					<Text
						type="secondary"
						style={{ textAlign: "center", display: "block" }}
					>
						Войдите с помощью выданного вам логина и пароля в ваш
						профиль администратора
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
					<Input
						placeholder="Логин"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						className={styles.input}
					/>

					<Input.Password
						placeholder="Пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={styles.input}
					/>

					<Button
						type="primary"
						size="large"
						onClick={handleAdminLogin}
						loading={loading}
						disabled={loading || success}
						className={styles.button}
					>
						Войти
					</Button>
				</Space>
			</Card>
		</div>
	);
}
