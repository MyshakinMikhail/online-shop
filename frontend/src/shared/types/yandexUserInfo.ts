export type YandexUserInfo = {
	id: string;
	login: string;
	client_id: string;
	display_name?: string;
	real_name?: string;
	first_name?: string;
	last_name?: string;
	sex?: string;
	default_email?: string;
	emails?: string[];
	default_avatar_id?: string;
	is_avatar_empty?: boolean;
	pwd_sha256?: string;
};
