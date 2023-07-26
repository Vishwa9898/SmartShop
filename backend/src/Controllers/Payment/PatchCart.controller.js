const Cart = require("../../Models/Cart");
const User = require("../../Models/User");

const PatchCart = async (req, res) => {
	const { totalItems, cartItems } = req.body;
	const user = req.user;
	const { _id: userId } = await User.findOne({ email: user.email });

	await Cart.updateOne(
		{
			userId,
		},
		{
			totalItems,
			cartItems,
		},
		{
			new: true,
			upsert: true,
			setDefaultsOnInsert: true,
		},
	);
	res.json({
		message: 'Cart updated successfully',
	});
};

module.exports = PatchCart;