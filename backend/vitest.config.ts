import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./tests/integration/setup.ts"],
		pool: "threads",
		maxWorkers: 1,
	},
});
