const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  isLoggedIn,
  isOccupied,
  isDetailAdded,
} = require("../helper/middleware");
const { upload } = require("../helper/multer");
const partner = require("../controller/partner");
const detail = require("../controller/detail");
const singleMaterial = require("../controller/singleMaterial");
//getpartner page just some instruction and link yo getpartner
router.get("/getpartner", isLoggedIn, partner.partnerPageWithSomeInstruction);
//finding unoccupied partner then sending to current user....
router.get("/getother", isLoggedIn, partner.contactofyourOpponent);
//changepartner request
router.get("/changepartner", partner.changepartnerRequestPage);

router.post("/changepartner", partner.addChangesReason);
//you will get another mail after some time
router.get("/changesreason", partner.sendingmailwithReason);
router
  .route("/your_detail")
  .get(isLoggedIn, detail.addyourDetailPage)
  .post(isLoggedIn, upload.single("image"), detail.postYourDetail);
router.get(
  "/your_detail_edit/:id",
  isLoggedIn,
  isDetailAdded,
  detail.editDetail
);
router
  .route("/your_detail_edit/:id")
  .put(
    isLoggedIn,
    upload.single("image"),
    isDetailAdded,
    detail.postedEditedDetail
  );
router.get(
  "/your_detail_delete/:id",
  isLoggedIn,
  isDetailAdded,
  detail.deletedDetail
);
router.get("/your_bio", isLoggedIn, isDetailAdded, detail.yourBio);
router.get("/single", isLoggedIn, singleMaterial.materialForSingle);
module.exports = router;
