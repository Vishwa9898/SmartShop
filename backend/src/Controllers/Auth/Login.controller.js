const { compare } = require("bcrypt");
const User = require("../../Models/User");
require("dotenv").config();
const { SignJWT } = require("../../utils/JWT");

const Login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({
			message: 'User not found',
		});
	}
	const isMatch = await compare(password, user.password);
	if (!isMatch) {
		return res.status(400).json({
			message: 'Invalid credentials',
		});
	}
	const data = {
		id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
		iat: Date.now(),
	};
	const token = SignJWT.sign(data, process.env.JWT_SECRET);

	res.json({
		message: 'Login successful',
		token,
	});
};


module.exports = 
    Login