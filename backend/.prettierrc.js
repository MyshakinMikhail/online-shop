export default {
	semi: true,
	trailingComma: "es5",
	singleQuote: false,
	printWidth: 100,
	tabWidth: 4,
	useTabs: true,
	bracketSameLine: false,
	arrowParens: "avoid",
	endOfLine: "lf",

	overrides: [
		{
			files: "*.{ts,tsx}",
			options: {
				parser: "typescript",
			},
		},
		{
			files: "*.md",
			options: {
				proseWrap: "always",
			},
		},
	],
};
