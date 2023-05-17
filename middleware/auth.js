import asyncHandler from "./asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  console.log(token);

  if (!token) {
    return next(
      new ErrorHandler("Pleaser login to access this resources", 401)
    );
  }

  const decodeData = jwt.verify(token, process.env.SECRET_KEY);
  req.user = await User.findById(decodeData.id);

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
    return next(new ErrorHandler(`Role:${req.user.role} is not allowed to access this routes`,403));
      }
      next();
      
    };
};

export default isAuthenticatedUser;