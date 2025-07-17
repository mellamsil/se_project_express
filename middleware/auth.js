const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const JWT_SECRET = "your-very-secure-secret";

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("Authorization header missing or malformed");
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload:", payload);
  } catch (err) {
    console.log("Token verification error:", err);
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  req.user = payload;
  next();
};
