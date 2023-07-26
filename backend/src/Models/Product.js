const { model, Schema } = require('mongoose');

const productSchema = new Schema({
	name: String,
	description: String,
	price: Number,
	image: [
		{
			url: String,
			alt: String,
		},
    ],
    thumnail: String,
	category: String,
	seller: String,
	description: String,
	discounted_price: Number,
});

const Product = model('Product', productSchema);
module.exports = Product;