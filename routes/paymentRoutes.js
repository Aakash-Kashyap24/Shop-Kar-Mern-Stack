import  express from "express";
import {
  checkoutSession,
  processPayment,
  sendStripeApiKey,
} from "../controller/paymentController.js";
import isAuthenticatedUser from "../middleware/auth.js";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router
  .route("/create-checkout-session")
  .post(isAuthenticatedUser, checkoutSession);

router.route("/stripeApikey").get(isAuthenticatedUser, sendStripeApiKey);

export const  PaymentRouter= router;
