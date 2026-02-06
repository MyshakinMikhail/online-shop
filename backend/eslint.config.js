import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	// Игнорируемые файлы/директории
	{
		ignores: ["node_modules", "dist", "build", "coverage", "*.config.js", "*.config.ts"],
	},

	// Основная конфигурация
	{
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			prettier: prettierPlugin,
		},
		extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic],
		rules: {
			// Prettier интеграция
			"prettier/prettier": "error",

			// TypeScript правила
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/require-await": "error",
			"@typescript-eslint/await-thenable": "error",

			// Правила для Node.js
			"no-process-exit": "error",
			"no-sync": "warn",

			// Общие правила
			eqeqeq: ["error", "always"],
			curly: ["error", "all"],
			"no-var": "error",
			"prefer-const": "error",
			"object-shorthand": "error",
			"prefer-template": "error",
		},
	},

	// Конфигурация для тестов (если будут)
	{
		files: ["**/*.test.ts", "**/*.spec.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"no-console": "off",
		},
	}
);
