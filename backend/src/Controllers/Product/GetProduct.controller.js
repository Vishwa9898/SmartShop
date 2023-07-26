const Product = require("../../Models/Product");
const { getOrSetCache } = require("../../utils/Redis");

const GetProduct = async (req, res) => {
	const { id } = req.params;
	const resp = await getOrSetCache(`product:${id}`, async () => {
		const product = await Product.findById(id);
		return { product };
	});

	res.json(resp);
}

module.exports = GetProduct;