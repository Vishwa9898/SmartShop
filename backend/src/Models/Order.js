const { model, Schema } = require('mongoose');

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
			qty: Number,
		},
	],
	total: Number,
	address: {
		city: String,
		state: String,
		pincode: String,
		address: String,
		country: String,
		phone: String,
		name:String,
	},
	paymentMode: String,
	status: {
		type: String,
		enum:[ 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled' ],
		default: 'delivered',
	},
}, {
	timestamps: true,
});

const Order = model('Order', orderSchema);

module.exports = Order;
