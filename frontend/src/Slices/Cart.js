import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    totalItems: 0,
    lastUpdated:null,
};
const cartSlice = createSlice({
	name: 'cart',
	initialState,
    reducers: {
        updateCart: (state, action) => {
            return action.payload;  
        },
		addToCart: (state, action) => {
			const item = action.payload;
            const product = state.cartItems.find((x) => x._id === item._id);
            state.lastUpdated = Date.now();
			if (product) {
				state.cartItems[state.cartItems.indexOf(product)].qty++;
			} else {
				state.cartItems.push({
					...item,
					qty: 1,
				});
            }
            state.totalItems++;
            
        },
        removeFromCart: (state, action) => {
            const item = action.payload;
            const product = state.cartItems.find((x) => x._id === item._id);
            state.lastUpdated = Date.now();

            state.totalItems -= product.qty ;
            if (product) {
                state.cartItems.splice(state.cartItems.indexOf(product), 1);
            }
        },
        incrementItem: (state, action) => { 
            const item = action.payload;
            const product = state.cartItems.find((x) => x._id === item._id);
            state.lastUpdated = Date.now();

            if (product) {
                state.cartItems[state.cartItems.indexOf(product)].qty++;
            }
            state.totalItems++;

        },
        decreamentItem: (state, action) => {
            const item = action.payload;
            const product = state.cartItems.find((x) => x._id === item._id);
            state.lastUpdated = Date.now();

            if (product) {
                if(state.cartItems[ state.cartItems.indexOf(product) ].qty > 1)
                    state.cartItems[ state.cartItems.indexOf(product) ].qty--;
                else 
                    state.cartItems.splice(state.cartItems.indexOf(product), 1);
            }
            state.totalItems--;
        },
        clearCart: (state) => { 
            state.cartItems = [];
            state.totalItems = 0;
            state.lastUpdated = Date.now();

        }
	},
});


export const { addToCart, removeFromCart,updateCart, incrementItem, decreamentItem,clearCart } = cartSlice.actions;
export default cartSlice.reducer;