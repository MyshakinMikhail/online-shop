import { CategoriesServise } from "@/entities/categories/api/CategoiesService";
import { setAllCategories } from "@/entities/categories/model/slice";
import { sizeOptions } from "@/shared/consts";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import type { Category, CreationProductType, Product } from "@/shared/types";
import { MyButton } from "@/shared/ui";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ProductForm.module.css";

type Props = {
	product?: Product | null;
	postForm: ({ productData }: { productData: CreationProductType | Product }) => void;
};

type FieldType = {
	name: string;
	description: string;
	sizes: string[];
	price: number;
	stock: number;
	categoryId: number;
};

export const ProductForm = ({ product, postForm }: Props) => {
	const [isActive, setIsActive] = useState<boolean>(product?.isActive || true);
	const allCategories = useSelector((state: RootState) =>
		state.category.allCategories.filter((category: Category) => category.id !== 1)
	);
	const dispatch = useDispatch<AppDispatch>();
	const [form] = Form.useForm<FieldType>();

	useEffect(() => {
		const fetchCategories = async () => {
			const categories = await CategoriesServise.getCategories();
			dispatch(setAllCategories({ allCategories: categories }));
		};
		fetchCategories();
	}, [dispatch]);

	useEffect(() => {
		if (product) {
			form.setFieldsValue({
				name: product.name,
				description: product.description,
				sizes: product.sizes,
				price: product.price,
				categoryId: product.categoryId,
				stock: product.stock,
			});
		}
	}, [product, form]);

	const categoryOptions =
		allCategories?.map(category => ({
			value: category.id,
			label: category.name,
		})) || [];

	const onFinish: FormProps<FieldType>["onFinish"] = values => {
		postForm({
			productData: {
				name: values.name,
				description: values.description,
				sizes: values.sizes,
				article: product?.article || "",
				price: values.price,
				categoryId: values.categoryId,
				stock: values.stock,
				isActive: isActive,
			},
		});
	};

	return (
		<Flex className={classes.content}>
			<Flex className={classes.images}>
				<img
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					width="530px"
					height="auto"
					style={{ borderRadius: "10px" }}
					alt="product"
				/>
				<img
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					width="530px"
					height="auto"
					style={{ borderRadius: "10px" }}
					alt="product"
				/>
			</Flex>
			<Form
				form={form}
				className={classes.form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					name: product?.name || "",
					description: product?.description || "",
					sizes: product?.sizes || [],
					price: product?.price || undefined,
					stock: product?.stock || undefined,
					categoryId: product?.categoryId,
				}}
			>
				<Form.Item<FieldType>
					label="Выберите категорию товара: "
					name="categoryId"
					rules={[{ required: true, message: "Пожалуйста, выберите категорию товара" }]}
					className={classes.formItem}
				>
					<Select
						className={classes.input}
						placeholder="Выберите категорию товара"
						options={categoryOptions}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label="Название товара: "
					name="name"
					rules={[
						{ required: true, message: "Пожалуйста, введите название товара" },
						{ min: 3, message: "Название должно содержать минимум 3 символа" },
					]}
					className={classes.formItem}
				>
					<Input className={classes.input} placeholder="Напишите название товара" />
				</Form.Item>

				<Form.Item<FieldType>
					label="Описание товара: "
					name="description"
					rules={[
						{ required: true, message: "Пожалуйста, введите описание товара" },
						{ min: 10, message: "Описание должно содержать минимум 10 символов" },
					]}
					className={classes.formItem}
				>
					<Input.TextArea
						className={classes.input}
						placeholder="Напишите описание товара"
						rows={4}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label="Доступные размеры: "
					name="sizes"
					rules={[{ required: true, message: "Пожалуйста, выберите размеры" }]}
					className={classes.formItem}
				>
					<Select
						mode="multiple"
						className={classes.input}
						placeholder="Выберите размеры"
						options={sizeOptions}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label="Цена в руб: "
					name="price"
					rules={[
						{ required: true, message: "Пожалуйста, введите цену товара" },
						{
							validator: (_, value) => {
								if (value === undefined || value === null || value === "") {
									return Promise.resolve();
								}
								const numValue = Number(value);
								if (isNaN(numValue)) {
									return Promise.reject(new Error("Введите корректное число"));
								}
								if (numValue < 0) {
									return Promise.reject(
										new Error("Цена не может быть отрицательной")
									);
								}
								return Promise.resolve();
							},
						},
					]}
					className={classes.formItem}
					getValueFromEvent={e => {
						return e.target.value ? Number(e.target.value) : undefined;
					}}
				>
					<Input
						type="number"
						className={classes.input}
						placeholder="Напишите цену товара"
						min={0}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label="Количество товара: "
					name="stock"
					rules={[
						{ required: true, message: "Пожалуйста, введите количество товара" },
						{
							validator: (_, value) => {
								if (value === undefined || value === null || value === "") {
									return Promise.resolve();
								}
								const numValue = Number(value);
								if (isNaN(numValue)) {
									return Promise.reject(new Error("Введите корректное число"));
								}
								if (numValue < 0) {
									return Promise.reject(
										new Error("Количество не может быть отрицательным")
									);
								}
								if (!Number.isInteger(numValue)) {
									return Promise.reject(
										new Error("Количество должно быть целым числом")
									);
								}
								return Promise.resolve();
							},
						},
					]}
					className={classes.formItem}
					getValueFromEvent={e => {
						return e.target.value ? Number(e.target.value) : undefined;
					}}
				>
					<Input
						type="number"
						className={classes.input}
						placeholder="Напишите общее количество товара"
						min={0}
						step={1}
					/>
				</Form.Item>

				{product && (
					<Form.Item className={classes.formItem}>
						<Button
							className={classes.isActiveButton}
							variant="solid"
							color={isActive ? "green" : "danger"}
							onClick={() => setIsActive(prevIsActive => !prevIsActive)}
						>
							{isActive ? "Сделать не активным" : "Сделать активным"}
						</Button>
					</Form.Item>
				)}

				<Form.Item className={classes.formItem}>
					<MyButton
						label={product ? "Сохранить изменения" : "Добавить новый товар"}
						onClick={() => form.submit()}
					/>
				</Form.Item>
			</Form>
		</Flex>
	);
}; // было бы круто, если бы форма не отправлялась при неизменности данных !!!
