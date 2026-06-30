import { afterAll, beforeAll } from "vitest";
import { clearAndCreateDB, disconnectDB } from "../../src/db/index";

beforeAll(async () => {
	// чистит таблицы, пересоздает бд для каждого тестового файла и подключается к ней!
	await clearAndCreateDB();
});

afterAll(async () => {
	// отключаем соединение с бд, после выполнения всех тестов
	await disconnectDB();
});
