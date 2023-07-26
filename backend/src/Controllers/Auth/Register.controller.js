const User = require('../../Models/User');
require('dotenv').config();
const { SignJWT } = require('../../utils/JWT');
const { hash } = require('../../utils/Encryption');

const Register = async (req, res) => {
	const { email, password, name, role } = req.body;
	const user = await User.findOne({ email });
	if (user && user._id) {
		return res.status(400).json({
			message: 'User already exists',
		});
	}
	const newUser = new User({
		email,
		password: await hash(password),
		name,
		role,
	});
	const data = {
		id: newUser._id || user._id,
		name: user?.name || name,
		email: user?.email || email,
		role: user?.role || role,
		iat: Date.now(),
	};
	const token = SignJWT.sign(data, process.env.JWT_SECRET);

	await newUser.save();
	res.json({
		message: 'User created successfully',
		token,
	});
};

module.exports = Register;
