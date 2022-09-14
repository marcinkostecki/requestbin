const mongoose = require("mongoose");

const reqSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  path: { type: String, required: true },
  method: { type: String, required: true },
  headers: { type: {}, required: true },
  body: { type: String, required: true },
});

const reqModel = mongoose.model("reqModel", reqSchema);

module.exports = reqModel;