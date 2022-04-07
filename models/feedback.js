const mongoose = require("mongoose");
const FeedBackUserSchema = new mongoose.Schema({
  yourfeedback: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("UserFeedBack", FeedBackUserSchema);
