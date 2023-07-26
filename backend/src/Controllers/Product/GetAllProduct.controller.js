const Product = require('../../Models/Product');
const Review = require('../../Models/Review');
const { getOrSetCache } = require('../../utils/Redis');

const GetAllProducts = async (req, res) => {
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
};

module.exports = GetAllProducts;
