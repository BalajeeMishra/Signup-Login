const express = require("express");
const router = express.Router();
const User = require("../models/user");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");
const passport = require("passport");
const { isVerified } = require("../helper/middleware");
const jwt = require("jsonwebtoken");
const { mailForVerify } = require("../helper/mailsendingfunction");
var id;
router.get("/", async (req, res) => {
  res.render("home", {
    user: req.user,
  });
});
var token;
router.get(
  "/register",
  wrapAsync(async (req, res, next) => {
    const name = "";
    const email = "";

    res.render("register", { name, email });
  })
);

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { name, email, password, password2, gender, telegram } = req.body;
      if (password != password2) {
        // errors.push({ msg: 'Passwords do not match' });
        return res.render("register", {
          name,
          email,
          password,
          password2,
          gender,
        });
      }
      if (password.length < 6) {
        return res.render("register", { name, email, password, gender });
      }
      req.session.token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACC_ACTIVATE,
        { expiresIn: "1m" }
      );
      // req.session.token = token;

      const user = new User({
        name,
        username: email,
        email,
        token: req.session.token,
        gender,
        telegram,
      });

      const registeredUser = await User.register(user, password).catch((e) => {
        // console.log(e.message);
        return res.json({ message: e.message });
      });
      id = registeredUser._id || null;
      if (typeof registeredUser != "undefined") {
        const result = await mailForVerify(email, req.session.token);
        console.log(result);
        if (result) {
          // return res.render("mail_verification", { mail_verify: true });
          return res.json({ mail_sent: true });
        }
      } else {
        return res.redirect("/register_1");
      }

      // return res.redirect("/register_1");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register_1");
    }
  })
);
router.get("/register_1", (req, res) => {
  res.render("register_1");
});
router.post("/register_1", async (req, res) => {
  const register1Data = req.body;
  await User.findOneAndUpdate({ _id: id }, register1Data, { new: true });
  res.send("lets see");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  isVerified,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    successFlash: true,
    successRedirect: "/",
  })
);
//token se ham find kar rahe hai .. yaha mail se bhi find kar sakte hai us case me agar token
//ko session me store karte hai to kya ye 20 minute ke ander me delete hoga thats question bro...
//okayyy.

// mujhe sikhna hoga how to delete session within 20 minutes or any specific time...
router.get("/login/:id", async (req, res) => {
  const id = req.params.id;
  if (id === req.session.token) {
    User.findOneAndUpdate(
      req.session.token,
      { verify: true },
      { upsert: true },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
      }
    );
    await User.findOneAndUpdate(
      id,
      { $unset: { token: 1 } },
      { useFindAndModify: false }
    );
    //iske thora check karna hai....
    delete req.session.token;
    req.flash("success", "YOU ARE VERIFIED NOW");
    return res.redirect("/register_1");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have Logged out successfully!");
  res.redirect("/login");
});

module.exports = router;
