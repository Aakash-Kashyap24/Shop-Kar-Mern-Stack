import asyncHandler from '../middleware/asyncHandler.js';
import stripePackage from "stripe";

import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
export const processPayment = asyncHandler(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

export const sendStripeApiKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});


export const checkoutSession=asyncHandler(async(req,res,next)=>{

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3001/checkout-success",
    cancel_url: "http://localhost:5173/",
  });

  res.send({
    url:session.url
  });
});
