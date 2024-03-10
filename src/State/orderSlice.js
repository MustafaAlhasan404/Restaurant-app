// @AceLoungeFrontend\src\State\orderSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    price: 0,
  },
  reducers: {
    addItem: (state, action) => {
      console.log(`Added to order: `);
      console.log(action.payload);
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
        // Calculate the new price first
        const newPrice = state.price - action.payload.price;

        // Remove the item from the array
        state.items.splice(index, 1);

        // Ensure the price is not negative
        state.price = newPrice >= 0 ? newPrice : 0;
      }
    },
    emptyOrder: (state) => {
      state.items = [];
      state.price = 0;
    },
    createOrder: (state, action) => {
      state.items = action.payload.products;
      state.price = action.payload.totalPrice;
    },
  },
});

export const { addItem, removeItem, emptyOrder, createOrder } = orderSlice.actions;
export default orderSlice.reducer;
