import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedProducts: [],
};

export const orderSlice = createSlice({
	name: "order",
	initialState: {
		items: [],
		price: 0,
	},
	reducers: {
		addItem: (state, action) => {
			console.log(`Added ${action.payload.product} to order: `);
			state.items.push(action.payload);
			state.price += action.payload.price;
		},
		removeItem: (state, action) => {
			console.log(`Removed item from order: ${action.payload.product}`);
			const index = state.items.findIndex((item) => {
				return (
					item.product === action.payload.product &&
					JSON.stringify(item.selectedOptions) ===
						JSON.stringify(action.payload.selectedOptions)
				);
			});

			if (index !== -1) {
				state.items.splice(index, 1);
				state.price -= action.payload.price;
			}
		},
		emptyOrder: (state) => {
			state.items = [];
			state.price = 0;
		},
	},
});

export const { addItem, removeItem, emptyOrder } = orderSlice.actions;
export default orderSlice.reducer;
