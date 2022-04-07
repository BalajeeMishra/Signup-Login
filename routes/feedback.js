const express = require("express");
const UserFeedBack = require("../models/feedback.js");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../helper/middleware");
router.get("/", async (req, res) => {
  res.render("feedback");
});
router.get("/all", async (req, res) => {
  const feedbacks = await UserFeedBack.find({});
  res.render("allfeedback", { feedbacks });
});
router.post("/", async (req, res) => {
  const newUserFeedBack = new UserFeedBack(req.body);
  if (req.user) {
    newUserFeedBack.userId = req.user._id;
  }
  await newUserFeedBack.save();
  res.redirect("/feedback/all");
});

module.exports = router;
