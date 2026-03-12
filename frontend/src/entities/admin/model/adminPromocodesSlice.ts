import type { Promocode } from "@/shared/types";
import type { CreationPromocode } from "@/shared/types/promocode";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteAllPromocodes } from "./asyncThunks/deleteAllPromocodes";
import { getAllPromocodes } from "./asyncThunks/getAllPromocodes";

type InitialStateType = {
	promocodes: Promocode[];
	isLoading: boolean;
	error: string | null;
};

const initialState: InitialStateType = { promocodes: [], isLoading: false, error: null };

const adminPromocodeSlice = createSlice({
	name: "adminPromocodes",
	initialState,
	reducers: {
		addPromocode: (state, action: PayloadAction<{ promocode: CreationPromocode }>) => {
			const findedPromocode = state.promocodes.find(
				currPromo => currPromo.name === action.payload.promocode.name
			);
			if (!findedPromocode) {
				state.promocodes.push({ id: Date.now(), ...action.payload.promocode });
			}
		},
		updatePromocode: (state, action: PayloadAction<{ promocode: Promocode }>) => {
			state.promocodes = state.promocodes.map(currPromo =>
				currPromo.id === action.payload.promocode.id ? action.payload.promocode : currPromo
			);
		},
		deletePromocode: (state, action: PayloadAction<{ promocodeId: number }>) => {
			state.promocodes = state.promocodes.filter(
				currPromo => currPromo.id !== action.payload.promocodeId
			);
		},
	},
	extraReducers: builder => {
		builder.addCase(getAllPromocodes.pending, state => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getAllPromocodes.fulfilled, (state, action) => {
			state.isLoading = false;
			state.promocodes = action.payload.promocodes;
		});
		builder.addCase(getAllPromocodes.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.error.message || "Неизвестная ошибка";
		});

		builder.addCase(deleteAllPromocodes.pending, state => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(deleteAllPromocodes.fulfilled, state => {
			state.isLoading = false;
			state.promocodes = [];
		});
		builder.addCase(deleteAllPromocodes.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.error.message || "Неизвестная ошибка";
		});
	},
});

export const { addPromocode, updatePromocode, deletePromocode } = adminPromocodeSlice.actions;
export const adminPromocodesReducer = adminPromocodeSlice.reducer;
