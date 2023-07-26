const jwt = require('jsonwebtoken');
class SignJWT {
	 constructor() {}
	 static sign(payload, secret, options) {
		return jwt.sign(payload, secret, options);
	}
	static verify(
		token,
		secret,
		options,
	) {
		return jwt.verify(token, secret, options);
	}
}


module.exports = {
    SignJWT,
};