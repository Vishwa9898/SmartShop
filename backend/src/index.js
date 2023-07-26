const express = require('express');
const app = express();
const connectMongoose = require('./utils/connectMongoose');
const cors = require('cors');
const VerifyUser = require('./Middlewares/verifyUser');
const paypal = require('./utils/paypal-api');
// Connect to MongoDB
connectMongoose();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const User = require('./Models/User');
const Product = require('./Models/Product');
const { getOrSetCache } = require('./utils/Redis');
const Review = require('./Models/Review');
const Order = require('./Models/Order');
const Cart = require('./Models/Cart');
// Routes
const AuthRouter = require('./Routes/Auth.route');

// Route middleware
app.use('/auth', AuthRouter);

app.get('/ping', (req, res) => {
	res.json({
		message: 'Pong 🔥 🔥 ',
	});
});

app.get('/products', async (req, res) => {
	const {
		page = 1,
		limit = 10,
		q = '',
		category = '',
		sort = 'Newest First',
	} = req.query;

	const resp = await getOrSetCache(
		`products?page=${page}&limit=${limit}&q=${q}&category=${category}&sort=${sort}`,
		async () => {
			const skip = (page - 1) * limit;
			const sortQuery = {};
			if (sort === 'Newest First') sortQuery.createdAt = -1;
			if (sort === 'Oldest First') sortQuery.createdAt = 1;
			if (sort === 'Highest Rated') sortQuery['Reviews.rating'] = -1;
			if (sort === 'Lowest Rated') sortQuery['Reviews.rating'] = 1;
			if (sort === 'Price: Low to High') sortQuery.discounted_price = 1;
			if (sort === 'Price: High to Low') sortQuery.discounted_price = -1;
			const products = await Product.find({
				name: { $regex: q, $options: 'i' },
				category: { $regex: category, $options: 'i' },
			})
				.sort(sortQuery)
				.skip(skip)
				.limit(limit);
			const total = await Product.countDocuments({
				name: { $regex: q, $options: 'i' },
				category: { $regex: category, $options: 'i' },
			});
			const totalPages = Math.ceil(total / limit);
			const resp = {
				products: await Promise.all(
					products.map(async (product) => {
						const rating = await Review.aggregate([
							{
								$match: {
									product: product._id,
								},
							},
							{
								$group: {
									_id: '$product',
									avgRating: { $avg: '$rating' },
								},
							},
						]);

						return {
							...product._doc,
							rating: rating[0]?.avgRating || 0,
						};
					}),
				),
				total,
				totalPages,
				page,
			};
			return resp;
		},
	);

	res.json(resp);
});

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const resp = await getOrSetCache(`product:${id}`, async () => {
		const product = await Product.findById(id);
		return { product };
	});

	res.json(resp);
});

app.get('/products/:id/reviews', async (req, res) => {
	const { id } = req.params;
	const { sort = 'Newest', filter = '1 star and above' } = req.query;

	const sortQuery = {};
	const filerQuery = {};

	if (sort === 'Newest') {
		sortQuery.createdAt = -1;
	}
	if (sort === 'Oldest') {
		sortQuery.createdAt = 1;
	}
	if (sort === 'Highest') {
		sortQuery.rating = -1;
	}
	if (sort === 'Lowest') {
		sortQuery.rating = 1;
	}
	if (filter === '1 star and above') {
		filerQuery.rating = { $gte: 0 };
	}
	if (filter === '2 star and above') {
		filerQuery.rating = { $gte: 1 };
	}
	if (filter === '3 star and above') {
		filerQuery.rating = { $gte: 2 };
	}
	if (filter === '4 star and above') {
		filerQuery.rating = { $gte: 3 };
	}
	if (filter === '5 stars') {
		filerQuery.rating = { $gte: 4 };
	}
	const reviews = await Review.find({ product: id, ...filerQuery })
		.sort(sortQuery)
		.populate('user');

	const total = await Review.countDocuments({ product: id }).sort(sortQuery);
	return res.json({
		reviews,
		total,
	});
});

app.post('/checkout', VerifyUser, async (req, res) => {
	const { products, shippingInfo, paymentMode, total } = req.body;
	const user = req.user;
	const { _id: userId } = await User.findOne({
		email: user.email,
	});

	const order = {
		user: userId,
		products: products.map((product) => ({
			product: product._id,
			qty: product.qty,
		})),
		total,
		address: shippingInfo,
		paymentMode,
	};

	const newOrder = new Order(order);
	await newOrder.save();
	res.json({
		message: 'Order placed successfully',
		order: newOrder,
	});
});
app.get('/orders', VerifyUser, async (req, res) => {
	const user = req.user;
	const { _id: userId } = await User.findOne({
		email: user.email,
	});

	const orders = await Order.find({ user: userId })
		.populate('products.product')
		.sort({ createdAt: -1 });
	return res.json({
		orders,
	});
});
app.get('/categories', async (req, res) => {
	const resp = await getOrSetCache('categories', async () => {
		const categories = await Product.find().distinct('category');
		return {
			categories,
		};
	});
	res.json(resp);
});

app.get('/can-review/:id', VerifyUser, async (req, res) => {
	const { id } = req.params;
	const user = req.user;
	const { _id: userId } = await User.findOne({
		email: user.email,
	});

	const order = await Order.findOne({
		user: userId,
		products: {
			$elemMatch: {
				product: id,
			},
		},
	}).limit(1);
	
	const review = await Review.findOne({
		user: userId,
		product: id,
	}).limit(1);

	const canReview = Boolean(order?.status);
	res.json({
		canReview,
		review,
	});
});

app.post('/products/:id/review', VerifyUser, async (req, res) => {
	const { title, description, rating } = req.body;
	const { id } = req.params;
	const user = req.user;
	const { _id: userId } = await User.findOne({
		email: user.email,
	});
	const prevReview = await Review.findOne({
		user: userId,
		product: id,
	});
	if (prevReview) {
		await Review.findByIdAndUpdate(prevReview._id, {
			title,
			description,
			rating,
		});
		return res.json({
			message: 'Review updated successfully',
			review: {
				...prevReview._doc,
				title,
				description,
				rating,
			},
		});
	}

	const review = new Review({
		user: userId,
		product: id,
		title,
		description,
		rating,
	});
	await review.save();
	res.json({
		message: 'Review added successfully',
		review: {
			...review._doc,
			user,
		},
	});
});

app.post('/cart', VerifyUser, async (req, res) => {
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
});

app.get('/cart', VerifyUser, async (req, res) => {
	const { _id: userId } = await User.findOne({
		email: req.user?.email,
	});
	const cart = await Cart.findOne({ userId }).populate('cartItems._id');
	res.json({
		cart: {
			...cart?._doc,
			cartItems: cart?.cartItems
				? await Promise.all(
					cart?.cartItems?.map(async (item) => {
							
						const productId = item?._id;
						
						const product = await Product.findById(productId);
						console.log(product);
							return {
								...item?._doc,
								...product?._doc,
							};
						}),
				  )
				: [],
			totalItems:cart?.totalItems || 0,
		},
	});
});

app.get('/paypal/token', async (req, res) => {
	const clientId = process.env.CLIENT_ID;
	try {
		const clientToken = await paypal.generateClientToken();
		res.json({
			clientToken,
			clientId,
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// create order
app.post('/paypal/orders', VerifyUser, async (req, res) => {
	try {
		const order = await paypal.createOrder(req.user.id);
		res.json(order);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// capture payment
app.post('/paypal/orders/:orderID/capture', VerifyUser, async (req, res) => {
	const { orderID } = req.params;
	try {
		const captureData = await paypal.capturePayment(orderID);

		// const cart = await Cart.findOne({ userId: req.user.id });
		// const order = {
		// 	user: req.user.id,
		// 	products: cart.cartItems.map((item) => ({
		// 		product: item._id,
		// 		qty: item.qty,
		// 	})),
		// 	total: captureData.purchase_units[0].payments.captures[0].amount.value,
		// 	address: {
		// 		name:
		// 			captureData.payer.name.given_name +
		// 			' ' +
		// 			captureData.payer.name.surname,
		// 		address:
		// 			captureData.purchase_units[0].shipping.address.address_line_1 +
		// 			' ' +
		// 			captureData.purchase_units[0].shipping.address.address_line_2,
		// 		state: captureData.purchase_units[0].shipping.address.admin_area_1,
		// 		city: captureData.purchase_units[0].shipping.address.admin_area_2,
		// 		country: captureData.purchase_units[0].shipping.address.country_code,
		// 		postalCode: captureData.purchase_units[0].shipping.address.postal_code,
		// 	},
		// 	paymentMode: 'PayPal',
		// 	status: 'confirmed',
		// };
		// const newOrder = new Order(order);
		// await newOrder.save();

		res.json(captureData);
	} catch (err) {
		console.log(err);
		res.status(500).send(err.message);
	}
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} 🔥 🔥 🔥 `);
});
