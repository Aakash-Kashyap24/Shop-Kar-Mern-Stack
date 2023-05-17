import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/ProductModel.js";
import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose  from "mongoose";
const { ObjectId } = mongoose.Types;




// Create New Order

export const newOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

 
    const user=await User.findById(req.user._id);
const userName=user?.firstName+" " + user?.lastName;

const order = await Order.create({
  shippingInfo,
  orderItems,
  paymentInfo,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  paidAt: Date.now(),
  user: req.user._id,
  userName: userName

});

// Iterate over the orderItems array and update product stock
for (let i = 0; i < order.orderItems.length; i++) {
  const item = order.orderItems[i];
  const product = await Product.findById(item.product);
  product.stock -= item.quantity;
  await product.save();
}

res.status(201).json({
  success: true,
  order,
});

// In this modified code, we are using a loop to iterate over the orderItems array, and for each item, we are finding the corresponding product by its ID, reducing its stock by the ordered quantity, and then saving the updated product to the database. This should correctly update the product quantities when a new order is created.

});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private

//  @desc Get logged in user orders
// @route GET /api/orders/myOrders
// @access Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });


  if (orders) {
    res.json({
      orders
    });
  } else {
    return next(new ErrorHandler("Error Not found", 404));
  }
});

export const getSingleOrders = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});


// Delete Single Order by User
export const deleteSingleOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const orderId = req.params.id; // extract the order ID from the request parameters

  // Find the order by ID and delete it
  const order = await Order.findOneAndDelete({ _id: orderId, user: userId });

  if (order) {
    res.status(200).json({ message: "Order deleted successfully" });
  } else {
    return next(new ErrorHandler("Order not found", 404));
  }
});





// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  let totalAmount = 0;

  orders.forEach((value, index, array) => {
    totalAmount = value.total;
  });

  res.json(orders);
});




// get orders of user --admin

export const getUserOrderAdmin=asyncHandler(async(req,res,next)=>{
const id=req.params.id;

const orders = await Order.find({ user: id});

res.status(200).json({
  success:true,
  orders
})

})





//get Single Orders By Admin
export const getSingleOrdersAdmin = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});






// Delete Single Order by Admin
export const deleteSingleOrdersAdmin = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const orders = await Order.find({ user: orderId });

  // Find the order by ID and delete it
  const order = await Order.findOneAndDelete({
    _id: orderId,
    
  });

  if (order) {
    res.status(200).json({ message: "Order deleted successfully" });
  } else {
    return next(new ErrorHandler("Order not found", 404));
  }
});



// Update Order Status --Admin

export const updateOrderAdmin = asyncHandler(async (req, res, next) => {
   const orderId = req.params.id;

   if (!ObjectId.isValid(orderId)) {
     return next(new ErrorHandler("Invalid order id", 400));
   }

   const order = await Order.findById(orderId);
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You Have Already delivered This ", 400));
  }

  order.orderItems.forEach(async(order) => {
   await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    order.isDelivered = true;
    for (let i = 0; i < order.orderItems.length; i++) {
      const item = order.orderItems[i];
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = -quantity;

  await product.save({ validateBeforeSave: false });
}
