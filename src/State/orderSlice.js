import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedProducts: [],
};

export const orderSlice = createSlice({
	name: "order",
	initialState: {
		items: [],
	},
	reducers: {
		addItem: (state, action) => {
			console.log(`Added ${action.payload.product} to order: `);
			state.items.push(action.payload);
			// console.log("Current Order: ", state);
		},
		removeItem: (state, action) => {
			console.log(`Removed ${action.payload.product} from order: `);
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
			// console.log("Current Order: ", state);
		},
	},
});

// Add action creators
export const addItemToOrder = (item) => {
	return {
		type: "order/addItem",
		payload: item,
	};
};

export const removeItemFromOrder = (itemId) => {
	return {
		type: "order/removeItem",
		payload: itemId,
	};
};

export const { addItem, removeItem } = orderSlice.actions;
export default orderSlice.reducer;