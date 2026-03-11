import { PromocodeService } from "@/entities/admin/api/PromocodeService";
import { deletePromocode } from "@/entities/admin/model/adminPromocodesSlice";
import type { Promocode } from "@/shared/types";
import { Avatar, Button, Flex, Typography } from "antd";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { PromocodeModal } from "../PromocodeModal/PromocodeModal";
import classes from "./PromocodeCard.module.css";

const { Text } = Typography;

type Props = {
	promocode: Promocode;
};

export default function PromocodeCard({ promocode }: Props) {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const dispatch = useDispatch();
	const handleDeletePromo = () => {
		dispatch(deletePromocode({ promocodeId: promocode.id }));
		PromocodeService.deletePromocode(promocode.name);
	};

	const handleEditPromo = () => {
		setIsModalOpen(true);
	};

	console.log(promocode.discount);

	return (
		<>
			<Flex className={classes.card}>
				<Button onClick={handleEditPromo} className={classes.button}>
					<Pencil />
				</Button>
				<Flex className={classes.content}>
					<Text className={classes.promoName}>{promocode.name}</Text>
					<Flex align="center" justify="center" gap={15}>
						<Text>{promocode.discount}%</Text>
					</Flex>
				</Flex>
				<Avatar
					className={promocode.isActive ? classes.activeButton : classes.notActiveButton}
				/>
				<Button onClick={handleDeletePromo} className={classes.button}>
					<Trash />
				</Button>
			</Flex>

			<PromocodeModal
				promocode={promocode}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</>
	);
}
