import express from "express";
import { deleteSingleOrders, deleteSingleOrdersAdmin, getAllOrdersAdmin, getMyOrders, getSingleOrders, getSingleOrdersAdmin, getUserOrderAdmin, newOrder, updateOrderAdmin } from "../controller/orderController.js";
import isAuthenticatedUser, { authorizeRoles } from "../middleware/auth.js";
const router = express.Router();



router.route('/order/new/').post(isAuthenticatedUser,newOrder);

router.route("/orders").get(isAuthenticatedUser, getMyOrders);
router.route("/order/:id").delete(isAuthenticatedUser, deleteSingleOrders);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrders);



// router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles('admin'), newOrder);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersAdmin);
router
  .route("/admin/order/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrdersAdmin);

router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteSingleOrdersAdmin);

  router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderAdmin);

  router
    .route("/admin/orders/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserOrderAdmin);


export const OrderRouter = router;
