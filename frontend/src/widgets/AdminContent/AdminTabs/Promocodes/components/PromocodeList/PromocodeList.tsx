import type { RootState } from "@/shared/lib/store";
import type { Promocode } from "@/shared/types";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import PromocodeCard from "../PromocodeCard/PromocodeCard";
import classes from "./PromocodeList.module.css";

const { Text } = Typography;

export default function PromocodeList() {
	const { promocodes } = useSelector((state: RootState) => state.adminPromocodes);

	return (
		<div className={classes.list}>
			{promocodes.length > 0 ? (
				promocodes.map((promo: Promocode) => (
					<PromocodeCard key={promo.name} promocode={promo} />
				))
			) : (
				<Text>Добавьте первый промокод!</Text>
			)}
		</div>
	);
}
