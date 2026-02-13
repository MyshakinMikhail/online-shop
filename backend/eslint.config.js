import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
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
			"unused-imports": unusedImports,
		},
		extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic],
		rules: {
			// Prettier интеграция
			"prettier/prettier": "error",

			// УДАЛЕНИЕ НЕИСПОЛЬЗУЕМЫХ ИМПОРТОВ
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			// TypeScript правила
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					ignoreRestSiblings: true, // Игнорировать оставшиеся элементы деструктуризации
					destructuredArrayIgnorePattern: "^_", // Игнорировать _ в массивах
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: false, // Для Express middleware и обработчиков
				},
			],
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
			"no-duplicate-imports": "error",
		},
	},

	// Конфигурация для тестов (если будут)
	{
		files: ["**/*.test.ts", "**/*.spec.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"no-console": "off",
			"unused-imports/no-unused-imports": "off", // Отключаем для тестов
			"unused-imports/no-unused-vars": "off",
		},
	}
);
