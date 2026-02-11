export default {
	semi: true,
	trailingComma: "es5",
	singleQuote: false,
	printWidth: 100,
	tabWidth: 4, // Должно соответствовать tabSize в VS Code
	useTabs: true, // Использовать табы вместо пробелов
	bracketSameLine: false,
	arrowParens: "avoid",
	proseWrap: "always",
	quoteProps: "as-needed",
	jsxSingleQuote: false,

	overrides: [
		{
			files: "*.json",
			options: {
				printWidth: 120,
			},
		},
		{
			files: "*.{ts,tsx}",
			options: {
				parser: "typescript",
			},
		},
		{
			files: "*.{css,scss}",
			options: {
				singleQuote: false,
			},
		},
	],
};
