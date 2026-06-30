import type { Roles } from "../../types/index";

export const AuthService = {
	hasAdminRights: (role: Roles) => {
		if (role === "admin" || role === "super_admin") {
			return true;
		}
		return false;
	},
};
