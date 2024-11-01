const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const joi = require("joi");
const { Home } = require("../models/home");
router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email or password");
    return;
  }
  const pass = await bcrypt.compare(req.body.password, user.password);
  if (!pass) {
    res.status(400).send("invalid email or password");
    return;
  }
  const token = user.genToken();
  res.header("x-auth-token", token);
  res.send("logged in successfully");
});
router.get("/home",auth,async (req,res)=>{
  const home = Home.findById(req.tokenPayload.homeId);
  res.send(home);
})
function validate(user) {
  const schema = joi.object({
    email: joi.string().email().min(3).max(255).required(),
    password: joi.string().required(),
  });
  return schema.validate(user);
}
module.exports = router;
