import { changeCategory } from "@/entities/categories/model/slice";
import { getCurrProductsByCategoryId } from "@/entities/product/model/asyncThunks";
import { updateCurrPage } from "@/entities/product/model/productsPageSlice";
import type { AppDispatch } from "@/shared/lib/store";
import type { Category } from "@/shared/types";
import { Typography } from "antd";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

type Props = {
	children: ReactNode;
	isUnderline: boolean;
	path: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
	category: Category;
};

export default function NavbarItem({ children, isUnderline, path, setOpen, category }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const handleClick = () => {
		navigate(path);
		dispatch(changeCategory(category));
		dispatch(updateCurrPage(1));
		dispatch(getCurrProductsByCategoryId({ categoryId: category.id }));
		setOpen(false);
	};

	return (
		<Text underline={isUnderline} style={{ cursor: "pointer" }} onClick={handleClick}>
			{children}
		</Text>
	);
}
