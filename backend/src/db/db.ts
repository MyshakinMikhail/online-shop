import sequelize from "./sequelize.ts";

export const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log("Соединение с бд было успешно установлено.");
	} catch (err) {
		console.error("Ошибка при подключении к бд:", err);
		throw err; // пробрасываем дальше, чтобы вызывающий код понимал, что соединение не удалось
	}
};

export const disconnectDB = async () => {
	try {
		await sequelize.close();
		console.log("Соединение с бд закрыто.");
	} catch (err) {
		console.error("Ошибка при закрытии соединения с бд:", err);
	}
};

export const createDB = async () => {
	try {
		await sequelize.sync();
		console.log("Таблицы созданы (если их не было).");
	} catch (err) {
		console.error("Ошибка при создании таблиц:", err);
		throw err;
	}
};

// очищает и пересоздаёт все таблицы
export const clearAndCreateDB = async () => {
	try {
		await sequelize.sync({ force: true });
		console.log("База очищена и таблицы пересозданы.");
	} catch (err) {
		console.error("Ошибка при очистке/создании БД:", err);
		throw err;
	}
};

// очищает все таблицы без удаления самих таблиц
export const clearTables = async () => {
	try {
		const models = Object.values(sequelize.models);
		for (const model of models) {
			await model.destroy({
				where: {},
				truncate: true,
				cascade: true,
				restartIdentity: true,
			});
		}
		console.log("Все таблицы очищены.");
	} catch (err) {
		console.error("Ошибка при очистке таблиц:", err);
		throw err;
	}
};
