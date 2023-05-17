import express from "express";
import {
  deleteReviews,
  getAdminProducts,
  getAllProducts,
  getAllReviewsOfSingleProduct,
  getProductById,
  updateProduct,
  updateReviews,
} from "../controller/ProductController.js";

import {
  deleteProduct,
  createProduct,
} from "../controller/ProductController.js";
import isAuthenticatedUser, { authorizeRoles } from "../middleware/auth.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);


router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.post(
  "/admin/new/product",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10), // handle multiple image uploads
  createProduct
);

router.route("/review").put(isAuthenticatedUser, updateReviews);
router.route("/all/reviews/:id").get(getAllReviewsOfSingleProduct);
router
  .route("/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReviews);

export const ProductRouter = router;
