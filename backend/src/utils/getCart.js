const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

const getCart = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate('cartItems._id');
	return {
		cart: {
			...cart._doc,
			cartItems: await Promise.all(
				cart.cartItems.map(async (item) => {
					const productId = item._id;
					const product = await Product.findById(productId);
					return {
						...item._doc,
						...product._doc,
					};
				}),
			),
		},
	};
};

module.exports = getCart;
