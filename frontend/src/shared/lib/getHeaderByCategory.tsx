export default function getHeadersByCategory(category: string): string {
	switch (category) {
		case "all":
			return "Все товары";
		case "tShirts":
			return "Футболки";
		case "hoodies":
			return "Худи";
		case "longSleeves":
			return "Лонгсливы";
		case "trousers":
			return "Штаны";
		default:
			return "Все товары";
	}
}
