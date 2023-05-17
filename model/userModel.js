import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    gender:{
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    phoneNumber:{
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true,
      validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    }
    ,
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Your password must be at least 8 characters long"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        default: "https://www.gravatar.com/avatar/default",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000,
  });
};


userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(process.env.SECRET_KEY,process.env.JWT_EXPIRE)
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
