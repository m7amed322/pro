const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("accses denied, no token provided");
  }
  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.tokenPayload = payload;
    next();
  } catch (err) {
    res.status(400).send("not valid token");
  }
};
