module.exports = function (req, res, next) {
    if (!req.tokenPayload.isAdmin) {
      res.status(403).send("access denied");
      return;
    }
    next();
  };