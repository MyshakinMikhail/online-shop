import { PromocodeService } from "@/entities/admin/api/PromocodeService";
import { addPromocode, updatePromocode } from "@/entities/admin/model/adminPromocodesSlice";
import type { Promocode } from "@/shared/types";
import { Card, Form, Input, InputNumber, Modal, notification, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { isAxiosError } from "axios";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useDispatch } from "react-redux";
import classes from "./PromocodeModal.module.css";

const { Title } = Typography;

type Props = {
	promocode?: Promocode;
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

type FieldType = {
	name: string;
	discount: number;
	isActive: boolean;
};

export const PromocodeModal = ({ promocode, isModalOpen, setIsModalOpen }: Props) => {
	const [form] = useForm<FieldType>();
	const [api, contextHolder] = notification.useNotification();
	const dispatch = useDispatch();

	const handleCancel = async () => {
		setIsModalOpen(false);
		if (promocode) {
			form.setFieldsValue({
				name: promocode.name,
				discount: promocode.discount,
				isActive: promocode.isActive,
			});
		} else {
			form.resetFields();
		}
	};

	const showError = (errorMessage: string) => {
		api.error({
			message: "Ошибка добавления/обновления промокода",
			description: errorMessage,
			placement: "top",
			duration: 3,
		});
	};

	const showSuccess = (successMessage: string) => {
		api.success({
			message: "Промокод успешно добавлен/обновлен",
			description: successMessage,
			placement: "top",
			duration: 3,
		});
	};

	useEffect(() => {
		form.setFieldsValue({
			name: promocode?.name,
			discount: promocode?.discount,
			isActive: promocode?.isActive,
		});
	}, [form, promocode]);

	const handlePostForm = async () => {
		const promocodeFields = form.getFieldsValue();
		if (promocode) {
			try {
				await PromocodeService.updatePromocode({ id: promocode.id, ...promocodeFields });
				dispatch(updatePromocode({ promocode: { id: promocode.id, ...promocodeFields } }));
				showSuccess("Промокод успешно обновлен");
				handleCancel();
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error.response?.data.message);
				} else {
					showError("Неизвестная ошибка при обновлении промокода на сервер");
				}
			}
		} else {
			try {
				const newPromocode = await PromocodeService.addPromocode(promocodeFields);
				dispatch(addPromocode({ promocode: newPromocode }));
				showSuccess("Промокод успешно добавлен");
				handleCancel();
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error.response?.data.message);
				} else {
					showError("Неизвестная ошибка при добавлении промокода на сервер");
				}
			}
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				open={isModalOpen}
				cancelText="Отменить"
				okText={promocode === undefined ? "Создать" : "Редактировать"}
				onCancel={handleCancel}
				onOk={handlePostForm}
				destroyOnHidden
			>
				<Card className={classes.card}>
					<Title level={4}>{promocode ? "Редактирование" : "Создание"} промокода</Title>
					<Form form={form} layout="vertical">
						<Form.Item<FieldType>
							name="name"
							label="Название промокода: "
							rules={[
								{
									required: true,
									message: "Пожалуйста, введите название промокода",
								},
								{ min: 3, message: "Минимум 3 символа" },
								{ max: 32, message: "Максимум 32 символа" },
							]}
						>
							<Input
								disabled={!!promocode}
								placeholder="Введите название промокода"
							/>
						</Form.Item>
						<Form.Item<FieldType>
							name="discount"
							label="Процент скидки: "
							rules={[
								{
									required: true,
									message: "Пожалуйста, введите скидку для промокода числом",
								},
								{
									type: "number",
									min: 0,
									max: 100,
									message: "Скидка должна быть числом от 0 до 100",
								},
							]}
						>
							<InputNumber
								style={{ width: "100%" }}
								placeholder="Введите скидку в процентах"
							/>
						</Form.Item>
						<Form.Item<FieldType>
							name="isActive"
							label="Сделать активным "
							rules={[
								{
									required: true,
									message: "Пожалуйста, введите нужно ли активировать промокод",
								},
							]}
						>
							<Select
								options={[
									{ value: false, label: "Нет" },
									{ value: true, label: "Да" },
								]}
							/>
						</Form.Item>
					</Form>
				</Card>
			</Modal>
		</>
	);
};
