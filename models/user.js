const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const jwt = require("jsonwebtoken");
const complexity = require("joi-password-complexity");
const config  = require("config");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    unique: true,
    require: true,
  },
  password: { type: String, required: true },
  home: {
    type: new mongoose.Schema({
      address: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true,
      },
      nRooms: { type: Number, min: 0, max: 10, required: true },
    }),
  },
  isAdmin:{type:Boolean,default:false}
});
userSchema.methods.genToken = function (){
    return jwt.sign(
        { id: this._id, email: this.email, homeId:this.home._id,isAdmin:false },
        config.get("jwtPrivateKey")
      );
}
const User = mongoose.model("user", userSchema);
function validateUser(user) {
  const schema = joi.object({
    requestId: joi.objectId().required(),
    homeId: joi.objectId().required(),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validateUser = validateUser;
