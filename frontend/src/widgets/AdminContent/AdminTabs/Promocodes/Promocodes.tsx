import { deleteAllPromocodes, getAllPromocodes } from "@/entities/admin/model/asyncThunks";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import { Button, Flex, Input } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Promocodes.module.css";
import { PromocodeList } from "./components";
import { PromocodeModal } from "./components/PromocodeModal/PromocodeModal";

export default function Promocodes() {
	const { isLoading, error } = useSelector((state: RootState) => state.adminPromocodes);
	const [content, setContent] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
		} catch (e) {
			if (isAxiosError(e)) {
				console.error(e.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при удалении всех промокодов");
			}
		}
	};

	if (error) {
		return <div>Ошибка: {error}</div>;
	}

	if (isLoading) {
		return <div>Загрузка промокодов, пожалуйста, подождите</div>;
	}

	return (
		<>
			<div className={classes.content}>
				<Flex gap={10}>
					<Input value={content} onChange={e => setContent(e.target.value)} />
					<Button onClick={handleAddPromo}>Добавить промокод</Button>
					<Button onClick={handleDeleteAllPromo} color="danger" variant="solid">
						Удалить все промокоды
					</Button>
				</Flex>
				<PromocodeList />

				<PromocodeModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			</div>
		</>
	);
}
