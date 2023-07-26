import { configureStore } from '@reduxjs/toolkit';
import User from './Slices/User';
import Cart from './Slices/Cart';
export default configureStore({
	reducer: {
		user: User,
		cart: Cart,
	},
});
