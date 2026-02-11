import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "path";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		ignores: ["node_modules", "dist"],
		plugins: {
			prettier: prettierPlugin,
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			sourceType: "module",
		},
		settings: {
			"import/resolver": {
				alias: {
					map: [["@", path.resolve(process.cwd(), "src")]],
					extensions: [".ts", ".tsx", ".js", ".jsx"],
				},
			},
		},
		rules: {
			// Prettier интеграция
			"prettier/prettier": "error",

			// TypeScript rules
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",

			// General rules
			// "no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},
]);
