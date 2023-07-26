const Order = require('../../Models/Order');
const User = require('../../Models/User');
const { getOrSetCache } = require('../../utils/Redis');

const GetAllOrders = async (req, res) => {
	const user = req.user;
	const { _id: userId } = await User.findOne({
		email: user.email,
	});

	const orders = await Order.find({ user: userId }).populate(
		'products.product',
	);
	return res.json({
		orders,
	});
};

module.exports = GetAllOrders;
