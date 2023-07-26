require('dotenv').config();

const { getOrSetCache } = require('../../utils/Redis');

const Me = async (req, res) => {
	const resp = await getOrSetCache(`me:${req.user.email}`, () => {
		return {
			user: req.user,
		};
	});
	res.json(resp);
};

module.exports = Me;
