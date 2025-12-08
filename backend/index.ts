import dotenv from "dotenv";
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post("/", (req, res) => {
    console.log(req.body);
	res.send("Сервер запущен1234");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
