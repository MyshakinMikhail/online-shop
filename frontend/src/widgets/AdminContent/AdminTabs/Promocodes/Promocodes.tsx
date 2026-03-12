import { deleteAllPromocodes, getAllPromocodes } from "@/entities/admin/model/asyncThunks";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import { Button, Flex, Input, Spin, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PromocodeList } from "./components";
import { PromocodeModal } from "./components/PromocodeModal/PromocodeModal";
import { useDeleteAllPromocodesNotification } from "./hooks";
import classes from "./Promocodes.module.css";

const { Text } = Typography;

export default function Promocodes() {
	const { isLoading, error } = useSelector((state: RootState) => state.adminPromocodes);
	const [content, setContent] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const { contextHolder, hideDeleteAllPromocodesConfirm, showDeleteAllPromocodesConfirm } =
		useDeleteAllPromocodesNotification();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchPromocodes = async () => {
			dispatch(getAllPromocodes({ searchQuery: content }));
		};
		fetchPromocodes();
	}, [dispatch, content]);

	const handleAddPromo = () => {
		setIsModalOpen(true);
	};

	const handleDeleteAllPromo = () => {
		try {
			dispatch(deleteAllPromocodes());
			hideDeleteAllPromocodesConfirm();
		} catch (e) {
			if (isAxiosError(e)) {
				console.error(e.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при удалении всех промокодов");
			}
		}
	};

	return (
		<>
			{contextHolder}

			<div className={classes.content}>
				<Flex gap={10}>
					<Input value={content} onChange={e => setContent(e.target.value)} />
					<Button onClick={handleAddPromo}>Добавить промокод</Button>
					<Button
						onClick={() =>
							showDeleteAllPromocodesConfirm({
								handleDeleteAllPromocodes: handleDeleteAllPromo,
							})
						}
						color="danger"
						variant="solid"
					>
						Удалить все промокоды
					</Button>
				</Flex>
				{isLoading ? <Spin className={classes.spinner} size="large" /> : null}
				{error && (
					<Flex>
						<Text>Ошибка загрузки промокодов: </Text>
						<Text>{error}</Text>
					</Flex>
				)}

				<PromocodeList />

				<PromocodeModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			</div>
		</>
	);
}
