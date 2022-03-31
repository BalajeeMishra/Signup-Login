const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: [true, "Username should be unique."],
  },
  token: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    required: true,
  },
  occupied: {
    type: Boolean,
    default: false,
  },

  changePartner: {
    type: Boolean,
  },
  reasonforchange: {
    type: String,
  },
  complaint: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  disable: {
    type: Boolean,
  },
  profile: {
    type: Boolean,
    default: false,
  },
  telegram: {
    type: String,
  },
  instagram: {
    type: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
