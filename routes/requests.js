const express = require("express");
const router = express.Router();
const { Request, validate } = require("../models/request");
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let request = await Request.findOne({email:req.body.email});
  if(request){
    res.status(400).send("you already sent a request");
    return;
  }
   request = new Request({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    homeAddress: req.body.homeAddress,
  });
  await request.save();
  res.send("request sended");
});
module.exports = router;
