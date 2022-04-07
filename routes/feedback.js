const express = require("express");
const UserFeedBack = require("../models/feedback.js");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../helper/middleware");
router.get("/", isLoggedIn, async (req, res) => {
  res.render("feedback");
});
router.get("/all", isLoggedIn, async (req, res) => {
  const feedbacks = await UserFeedBack.find({});
  console.log(feedbacks);
  res.render("allfeedback", { feedbacks });
});
router.post("/", isLoggedIn, async (req, res) => {
  const newUserFeedBack = new UserFeedBack(req.body);
  newUserFeedBack.userId = req.user._id;
  await newUserFeedBack.save();
  res.redirect("/feedback/all");
});

module.exports = router;
