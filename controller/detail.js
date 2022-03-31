const UserDetail = require("../models/detailuser");
const User = require("../models/user");
module.exports.addyourDetailPage = async (req, res) => {
  res.render("your_detail", { isDetail: req.session.profile });
};
module.exports.postYourDetail = async (req, res) => {
  const newUserDetail = new UserDetail(req.body);
  newUserDetail.image = req.file.filename;
  newUserDetail.userId = req.user._id;
  await newUserDetail.save();
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { profile: true },
    { new: true }
  );
  res.redirect("/partner/your_bio");
};
module.exports.yourBio = async (req, res) => {
  const yourDetail = await UserDetail.find({ userId: req.user._id });
  const UserDetails = await User.findById(req.user._id);
  res.render("yourbio", { yourDetail: yourDetail[0], UserDetails });
};
module.exports.editDetail = async (req, res) => {
  const { id } = req.params;
  const userdetail = await UserDetail.findById(id);
  const users = await User.findById(req.user._id);

  res.render("edit_your_detail", { userdetail, users });
};

module.exports.postedEditedDetail = async (req, res) => {
  const { id } = req.params;
  const userDetail = await UserDetail.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  userDetail.image = req.file.filename;
  await userDetail.save();
  res.redirect("/partner/your_bio");
};
module.exports.deletedDetail = async (req, res) => {
  const { id } = req.params;
  const userDetail = await UserDetail.findById(id);
  await userDetail.delete();
  await User.findOneAndUpdate({ _id: req.user._id }, { profile: false });
  res.redirect("/partner/your_bio");
};
