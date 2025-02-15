const mongoose = require("mongoose");

const khoaSchema = new mongoose.Schema({
  Tenkhoa: { type: String },
});

const Khoa = mongoose.model("Khoa", khoaSchema);
module.exports = Khoa;
