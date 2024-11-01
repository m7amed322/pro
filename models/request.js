const mongoose = require("mongoose");
const joi = require("joi");
const requestSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    unique: true,
  },
  phoneNumber: { type: String, minlength: 5, maxlength: 15, required: true },
  homeAddress: { type: String, minlength: 10, maxlength: 255, required: true },
});
const Request = mongoose.model("request", requestSchema);
function validate(request) {
  const schema = joi.object({
    email: joi.string().email().min(3).max(255).required(),
    phoneNumber: joi.string().min(5).max(15).required(),
    homeAddress: joi.string().min(10).max(255).required(),
  });
  return schema.validate(request);
}
exports.Request = Request;
exports.validate = validate;
