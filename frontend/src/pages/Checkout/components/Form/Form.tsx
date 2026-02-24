import { mockCities } from "@/shared/mocks";
import { MyButton } from "@/shared/ui";
import { Flex, Input, Select, Typography } from "antd";
import { useState } from "react";
import classes from "./Form.module.css";

const { Title } = Typography;

export const Form = () => {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [promoCode, setPromoCode] = useState<string>("");

	const hanleSendOrder = () => {
		console.log("отправить заказ на бэк");
	};

	return (
		<Flex className={classes.form} vertical>
			<Flex vertical>
				<Title level={5}>Ваше имя</Title>
				<Input size="large" value={name} onChange={e => setName(e.target.value)} />
			</Flex>
			<Flex vertical>
				<Typography.Title level={5}>Почта</Typography.Title>
				<Input size="large" value={email} onChange={e => setEmail(e.target.value)} />
			</Flex>
			<Flex vertical>
				<Typography.Title level={5}>Телефон</Typography.Title>
				<Input
					size="large"
					value={phoneNumber}
					onChange={e => setPhoneNumber(e.target.value)}
				/>
			</Flex>
			<Flex vertical>
				<Typography.Title level={5}></Typography.Title>
				<Flex gap={10}>
					<Input
						size="large"
						placeholder="Промокод"
						value={promoCode}
						onChange={e => setPromoCode(e.target.value)}
					/>
					<MyButton label="Активировать" />
				</Flex>
			</Flex>
			<Title level={5}>Доставка</Title>

			<Flex vertical style={{ marginBottom: "20px" }}>
				<Title level={5}>Город</Title>
				<Select options={mockCities} />
			</Flex>

			<MyButton label="Оформить" onClick={hanleSendOrder} />
		</Flex>
	);
};
