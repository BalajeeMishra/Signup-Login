const mongoose = require("mongoose");

// const ImageSchema = new mongoose.Schema({
//   url: String,
//   filename: String,
// });
const DetailUserSchema = new mongoose.Schema({
  height: {
    type: Number,
  },
  hobbies: {
    type: String,
  },
  about: {
    type: String,
  },
  address: {
    type: String,
  },
  instagram: {
    type: String,
  },
  image: {
    type: String,
    // required: [true, "Uploaded file must have a name"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  birthday: {
    type: Date,
  },
});

module.exports = mongoose.model("UserDetail", DetailUserSchema);
