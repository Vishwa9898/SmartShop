const Review = require("../../Models/Review");
const { getOrSetCache } = require("../../utils/Redis");


const GetAllReviews = async (req, res) => {
	const { id } = req.params;
	const { sort = 'Newest', filter = '1 star and above' } = req.query;
	const resp = await getOrSetCache(
		`products:${id}/reviews?sort=${sort}&filter=${filter}`,
		async () => {
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
				filerQuery.rating = { $gte: 1 };
			}
			if (filter === '2 star and above') {
				filerQuery.rating = { $gte: 2 };
			}
			if (filter === '3 star and above') {
				filerQuery.rating = { $gte: 3 };
			}
			if (filter === '4 star and above') {
				filerQuery.rating = { $gte: 4 };
			}
			if (filter === '5 stars') {
				filerQuery.rating = { $gte: 5 };
			}
			const reviews = await Review.find({ product: id, ...filerQuery })
				.sort(sortQuery)
				.populate('user');

			const total = await Review.countDocuments({ product: id }).sort(
				sortQuery,
			);
			return {
				reviews,
				total,
			};
		},
	);
	res.json(resp);
}

module.exports = GetAllReviews;