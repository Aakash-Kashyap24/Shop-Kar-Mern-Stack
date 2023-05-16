import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import sendToken from "../utils/token.js";
import cloudinary from "cloudinary";
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const salt = bcrypt.genSaltSync(10);

// Resister Us\er

export const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, gender, address } =
    req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // res.status(400).json({ success: false, message: "User already exists" });
    return next(new ErrorHandler("User already exists", 404));
  }
  console.log(firstName, lastName, email, password);
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    firstName,
    lastName,
    email,
    gender,
    address,

    phoneNumber,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const secretKey = process.env.SECRET_KEY; // Replace this with your own secret key

  // const token = jwt.sign(payload, secretKey, options);
  sendToken(user, 200, res);


});


// Login Us\er

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User Not Found ):", 401));
  }

  // Check if password matches

  // const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }

  // const token = jwt.sign(payload, secretKey, options);
  sendToken(user, 200, res);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({ user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// export const updateProfile = asyncHandler(async (req, res, next) => {
//    const newUserData = {
//      name: req.body.name,
//      email: req.body.email,
// phoneNumber:req.body.phoneNumber,
// address:req.body.address
//    };

//   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",

//     width: 150,
//     crop: "scale",
//   });

//   const updateImage = await cloudinary.uploader.upload(req.body.avatar, {
//     public_id: myCloud.public_id,
//   });

//   user.name = req.body.name || user.name;
//   user.email = req.body.email || user.email;
//   user.avatar.public_id = updateImage.public_id || user.avatar.public_id;
//   user.avatar.url = updateImage.secure_url || user.avatar.url;
//   user.firstName = req.body.firstName || user.firstName;
//   user.lastName = req.body.lastName || user.lastName;
//   user.gender = req.body.gender || user.gender;
//   user.address = req.body.address || user.address;
//   user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

//   const updatedUser = await user.save();

//   res.status(200).json({ success: true, data: updatedUser });
// });

export const updateUserProfile = asyncHandler(async (req, res, next) => {

  try {
    const { firstName, lastName, email, phoneNumber, gender, address, avatar } =
      req.body;

    const newUserData = {
      firstName,
      lastName,
      email,
      gender,

      address,
      phoneNumber,
    };

    if (avatar != ""){
      const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

      // console.log("HereUser", user);
      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);


      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });


      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }



    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }



    res.status(200).json({
      success: true,
    });
  } catch (error) {
        return next(new ErrorHandler(error.message, 400));

  }
});







// Update Password

export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const { oldPassword, newPassword, confirmPassword } = req.body;

  const isMatched = await user.matchPassword(oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Original Password ", 404));
  }

  if (newPassword !== confirmPassword) {
    res
      .status(404)
      .json({ success: false, message: "Invalid Original Password " });
    return;
  }

  user.password = newPassword;
  const updatedUser = await user.save();

  res.status(200).json({ success: true, data: updatedUser });
});






// logout
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});



// forgotPassword
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  
  if (!user) {
    return next(new ErrorHandler("User Not found ", 404));
  }


  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If You have not requested this email then, Pleaser Ignore Balraj`;

  try {

    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery ",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });

  } catch (error) {

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});



// Reset Password
export const ResetPassword = asyncHandler(async (req, res, next) => {



  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("reset password token is expire or invalid", 400)
    );
  }

  const { password } = req.body;



  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  sendToken(user, 200, res);
});



// Admin Get All Users

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    Users: users,
  });
});



// Admin   Users BY Id
export const getUsersById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({
    success: true,
    User: user,
  });
});



// Admin Update Users BY Id
export const adminUpdateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.avatar = req.body.avatar || user.avatar;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();

  res.status(200).json({ success: true, message: "user updated Successfully" });
});



// Admin Delete Users BY Id
export const deleteUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({ success: true, message: "user deleted Successfully" });
});
