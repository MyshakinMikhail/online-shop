import { describe, expect, it } from "vitest";
import { AuthService } from "./AuthService";

describe("AuthService testing", () => {
	it("hasAdminRights admin", () => {
		const isAdminRoles = AuthService.hasAdminRights("admin");
		expect(isAdminRoles).toBe(true);
	});
	it("hasAdminRights super_admin", () => {
		const isAdminRoles = AuthService.hasAdminRights("super_admin");
		expect(isAdminRoles).toBe(true);
	});
	it("hasAdminRights user", () => {
		const isAdminRoles = AuthService.hasAdminRights("user");
		expect(isAdminRoles).toBe(false);
	});
});
