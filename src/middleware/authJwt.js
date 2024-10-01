const jwt = require("jsonwebtoken");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
	}

	return res.status(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		return res.status(403).send({
			message: "No token provided!",
		});
	}

	jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
		if (err) {
			return catchError(err, res);
		}
		//Từ token mình biết được nó là của người dùng nào và gắn ở đây để gửi sang controller sau dùng.
		req.authenticatedUser = decoded.user;
		next();
	});
};

const authJwt = {
	verifyToken: verifyToken,
};
module.exports = authJwt;
