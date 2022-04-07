const UserDetail = require("../models/detailuser");
const User = require("../models/user");
const { mailForComplaint } = require("../helper/mailsendingfunction");
module.exports.partnerPageWithSomeInstruction = async (req, res) => {
  res.render("partner");
};
module.exports.contactofyourOpponent = async (req, res, next) => {
  try {
    //importanttttt
    if (req.user.disabled) {
      throw "we already sent an opponent detail to you,please wait for reply.you can see this mail in your profile section";
    }
    if (!(await UserDetail.find({ userId: req.user._id }))[0]) {
      const yourDetail = new UserDetail({ userId: req.user._id });
      await yourDetail.save();
    }

    let bool = true;
    let gender = req.user.gender;
    if (gender === "male") {
      gender = "female";
    } else {
      gender = "male";
    }

    const getothers = await User.find({
      occupied: false,
      gender: gender,
      verify: true,
    });
    const leng = getothers.length;

    if (leng == 0) {
      throw "Sorry,Come here after some time,Right now we don't have partner for you";
      // Give us some time we will give you,your opponent detail shortly through your mail.Please keep your eyes on email you got in this period
    }
    while (bool) {
      let selectedindexfromlist = Math.floor(Math.random() * leng + 1);
      if (selectedindexfromlist == leng) {
        selectedindexfromlist = selectedindexfromlist - 1;
      }
      const e = getothers[selectedindexfromlist];
      // && !req.user
      if (!e.occupied) {
        const mail = e.email;

        if (e.telegram) {
          const telegram = e.telegram;
          await UserDetail.findOneAndUpdate(
            { userId: req.user._id },
            { opponentmail: mail, opponenttelegram: telegram },
            { new: true }
          );
        }
        // o us user ke liye hoga nnn ---->mrityunjay
        req.session.opponentmail = mail;
        await User.findOneAndUpdate(
          { email: mail },
          { occupied: true },
          { new: true }
        );
        await UserDetail.findOneAndUpdate(
          { userId: req.user._id },
          { opponentmail: mail },
          { new: true }
        );
        await User.findOneAndUpdate(
          { _id: req.user._id },
          { disabled: true },
          { new: true }
        );
        bool = false;
        var url;
        if (e.telegram) {
          let telegram = e.telegram;
          telegram = telegram.substring(1);
          url = "https://telegram.me/" + telegram;
          console.log(telegram, url);
        }
        return res.render("mailsending", {
          mail: e.email,
          telegram: url,
        });
      }
    }
  } catch (e) {
    next(e);
  }
};
module.exports.changepartnerRequestPage = async (req, res) => {
  res.render("changepartner");
};
module.exports.addChangesReason = async (req, res) => {
  const reason = req.body.reason;

  req.session.reason = reason;
  //findoneandupdate
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { reasonforchange: reason },
    { new: true }
  );
  //count wala krna hai
  const opponent = await User.findOne({ email: req.session.opponentmail });
  opponent.reason = reason;
  opponent.count += 1;
  await opponent.save();
  res.redirect("/partner/changesreason");
};

module.exports.sendingmailwithReason = async (req, res, next) => {
  try {
    const opponentmail = req.session.opponentmail;
    await mailForComplaint(opponentmail);
    res.render("changesreason");
  } catch (e) {
    next(e);
  }
};
