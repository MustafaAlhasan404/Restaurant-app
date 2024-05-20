import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./src/State/orderSlice";

export default configureStore({
	reducer: {
		order: orderReducer,
	},
});
