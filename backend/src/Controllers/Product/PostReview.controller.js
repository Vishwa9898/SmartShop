const Review = require("../../Models/Review");
const User = require("../../Models/User");

const PostReview = async (req, res) => {
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
};

module.exports = PostReview;