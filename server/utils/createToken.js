const { sign } = require('jsonwebtoken');
const { privatekey } = process.env;
module.exports = {
	createToken: (user) => {
		const token = sign({ id: user._id }, privatekey, { expiresIn: '24h' });
		user.accessToken = token;
		return token;
	}
};
