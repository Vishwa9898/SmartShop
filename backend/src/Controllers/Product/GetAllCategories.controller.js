const Product = require("../../Models/Product");
const { getOrSetCache } = require("../../utils/Redis");

const GetAllCategories= async (req, res) => {
	const resp = await getOrSetCache('categories', async () => {
		const categories = await Product.find().distinct('category');
		return {
			categories,
		};
	});
	res.json(resp);
}

module.exports = GetAllCategories;