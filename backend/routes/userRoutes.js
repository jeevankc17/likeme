const express = require("express");
const user_route = express();
const {
  registerUser,
  authUser,
  allUsers,
  postLocation,
  updatePassword,
  forgetPassword,
  resetPassword,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/location").post(protect, postLocation);
//update password route
router.route("/update-password").post(protect, updatePassword);
router.post("/forget-password", forgetPassword);
router.get("/reset-password", resetPassword);



//router.post("/update-password", updatePassword);

//user_route.post('/api/user/update-password', user_controller.updatePassword);


module.exports = router;
