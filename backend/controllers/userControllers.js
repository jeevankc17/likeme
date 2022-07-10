const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcryptjs = require("bcryptjs");
const res = require("express/lib/response");
const config = require("../config/config");




const nodemailer = require("nodemailer");
const randomstring = require("randomstring");




const sendResetPasswordMail = async (name, email, token) => {

  try {
    

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'For Reset Password',
      html: '<p> Hii ' + name + ', Please copy the link and <a href="http://127.0.0.1:3000/api/reset-password?token=' + token + '"> reset your password</a>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Mail has been sent:- ", info.response);
      }
    });

  } catch (error) {
    console.log("400 error")
    //res.status(400).send({ success: false, msg: error.message });
  }

}




const securePassword = async (password) => {

  try {

    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }

}

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  //console.log(req);
  res.send(users);
});






//@description     Get or Search users inside location
//@route           POST /api/user/location
//@access          Public
const postLocation = asyncHandler(async (req, res) => {
  const { lng, lat } = req.body;
  const user = await User.find({ _id : { $eq: req.user._id } });
  //const user = await User.find({ _id: { $ne: req.user._id } });

  if (user) {
    const updateLocation = await User.updateMany({ "_id": req.user._id }, { $set: { "location": { "type": "Point", "coordinates": [lng, lat] } } });
    const geousers = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "dist.calculated",
          maxDistance: 1000000, spherical: true
        }

      }]);
    console.log(geousers);
    res.send(geousers);
  };

  console.log(user[0]._id);
});




//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});




//update password method

const updatePassword = async (req, res) => {
  try {

    const user_id = req.body.user_id;
    const password = req.body.password;

    const data = await User.findOne({ _id: user_id });

    if (data) {
      const newPassword = await securePassword(password);

      const userData = await User.findByIdAndUpdate({ _id: user_id }, {
        $set: {
          password: newPassword
        }
      });

      res.status(200).send({ success: true, msg: "Your password has been updated" });
    }
    else {
      res.status(200).send({ success: false, msg: "User Id not found!" });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}



//forget password

const forgetPassword = async (req, res) => {
  try {

    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendResetPasswordMail(userData.name, userData.email, randomString);
      res.status(200).send({ success: true, msg: "Please check your inbox of mail and reset your password." });
    }
    else {
      res.status(200).send({ success: true, msg: "This email does not exists." });
    }

  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}



//reset Password

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newPassword  } }, { new: true });
      res.status(200).send({ success: true, msg: "User Password has been reset", data: userData });
    }
    else {
      res.status(200).send({ success: true, msg: "This link has been expired." });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}



module.exports = { allUsers, registerUser, authUser, postLocation, updatePassword, forgetPassword, resetPassword };
