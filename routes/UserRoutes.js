import {
  registerUser,
  updateUserProfile,
  loginUser,
  getUserProfile,
  updatePassword,
  forgotPassword,
  ResetPassword,
  getAllUsers,
  getUsersById,
  deleteUserProfile,
  adminUpdateUserProfile,
} from "../controller/UserController.js";

import express from "express";
import { logout } from '../controller/UserController.js';
import isAuthenticatedUser, { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(ResetPassword);
router.route('/profile').get(isAuthenticatedUser,getUserProfile);
router.route("/upd/profile").put(isAuthenticatedUser, updateUserProfile);
router.route("/profile").put(isAuthenticatedUser, getUserProfile);
router.route("/upd/pass").put(isAuthenticatedUser, updatePassword);
router.route('/logout').get(logout);

// Admin Routes
  
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getUsersById)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router
  .route("/admin/user/:id")
  
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserProfile)
  .put(isAuthenticatedUser, authorizeRoles("admin"), adminUpdateUserProfile);

const userRoutes=router;
export default userRoutes;
