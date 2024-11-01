const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { Request } = require("../models/request");
const { Home, validate } = require("../models/home");
const { User, validateUser } = require("../models/user");
const {Admin,validateAdmin}=require("../models/admin");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin")
router.get("/request",[auth,admin], async (req, res) => {
  const request = await Request.find();
  if (request.length === 0) {
    res.status(404).send("no requests founded");
    return;
  }
  res.send(request);
});
router.post("/home", [auth,admin],async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const request = await Request.findById(req.body.requestId);
  if (!request) {
    res.status(404).send("wrong request ID");
    return;
  }
  const home = new Home({
    address: request.homeAddress,
    userEmail:request.email,
    nRooms: req.body.nRooms,
  });
  await home.save();
  res.send("created successfully");
});
router.post("/user",[auth,admin], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const request = await Request.findById(req.body.requestId);
  if (!request) {
    res.status(404).send("wrong request ID");
    return;
  }
  const home = await Home.findById(req.body.homeId);
  if (!home) {
    res.status(404).send("wrong home ID");
    return;
  }
  let user = new User({
    email: request.email,
    password: request.email,
    home: { address: home.address, nRooms: home.nRooms ,_id:home._id},
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save()
  res.send("user created successfully")
});
router.post("/login", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let admin = await Admin.findOne({ email: req.body.email });
  if (!admin) {
    res.status(400).send("invalid email or password");
    return;
  }
  const pass = await bcrypt.compare(req.body.password, admin.password);
  if (!pass) {
    res.status(400).send("invalid email or password");
    return;
  }
  const token = admin.genToken();
  res.header("x-auth-token", token);
  res.send("logged in successfully");
});
//create admin
// router.post("/",async (req,res)=>{
//   const {error} = validateAdmin(req.body)
//   if(error){
//     res.status(400).send(error.details[0].message)
//     return;
//   }
//   let admin = await Admin.findOne({email:req.body.email});
//   if(admin){
//     res.status(400).send("already registered");
//     return;
//   }
//   admin = new Admin({
//     email:req.body.email,
//     password:req.body.password
//   })
//   const salt =await  bcrypt.genSalt(10);
//   admin.password = await bcrypt.hash(req.body.password,salt);
//   await admin.save()
//   res.send("admin created successfully")
// })
module.exports = router;
