import type { YandexUserInfo } from "../types/yandexUserInfo";

const YANDEX_CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID || "your-client-id";
const YANDEX_REDIRECT_URI = import.meta.env.VITE_YANDEX_REDIRECT_URI || "your-redirect-uri";

export function getYandexAuthUrl(): string {
	const params = new URLSearchParams({
		response_type: "code",
		client_id: YANDEX_CLIENT_ID,
		redirect_uri: YANDEX_REDIRECT_URI,
	});

	return `https://oauth.yandex.ru/authorize?${params.toString()}`;
}

export function initiateYandexAuth(): void {
	const authUrl = getYandexAuthUrl();
	window.location.href = authUrl;
}

export function getAuthCodeFromUrl(): string | null {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("code");
}

export async function exchangeCodeForToken(code: string): Promise<{
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
}> {
	const clientSecret = import.meta.env.VITE_YANDEX_CLIENT_SECRET || "";

	const requestBody = new URLSearchParams({
		grant_type: "authorization_code",
		code: code,
		client_id: YANDEX_CLIENT_ID,
		redirect_uri: YANDEX_REDIRECT_URI,
	});

	if (clientSecret) {
		requestBody.append("client_secret", clientSecret);
	}

	const response = await fetch("https://oauth.yandex.ru/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: requestBody,
	});

	const responseText = await response.text();

	if (!response.ok) {
		let errorMessage = `Ошибка обмена кода на токен: ${response.status} ${response.statusText}`;
		try {
			const errorData = JSON.parse(responseText);
			if (errorData.error_description) {
				errorMessage = errorData.error_description;
			} else if (errorData.error) {
				errorMessage = errorData.error;
			}
		} catch {
			errorMessage = responseText || errorMessage;
		}
		throw new Error(errorMessage);
	}

	try {
		return JSON.parse(responseText);
	} catch {
		throw new Error("Не удалось распарсить ответ от сервера");
	}
}

export async function getUserInfo(accessToken: string): Promise<YandexUserInfo> {
	const response = await fetch("https://login.yandex.ru/info", {
		headers: {
			Authorization: `OAuth ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to get user info: ${response.statusText}`);
	}

	return response.json();
}
