import express from "express";
import "../strategies/local-strategy.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import OrderController from "../controller/OrderController.js";
const OrderRouter = express.Router();

OrderRouter.post(
  "/place-order",
  AuthMiddleware.ensureAuthenticated,
  OrderController.placeOrder
);

OrderRouter.get(
  "/history",
  AuthMiddleware.ensureAuthenticated,
  OrderController.getOrderHistory
);

OrderRouter.get(
  "/get-orders",
  AuthMiddleware.ensureAuthenticated,
  AuthMiddleware.ensureRole("admin"),
  OrderController.getOrders
);

OrderRouter.patch(
  "/cancel/:orderId",
  AuthMiddleware.ensureAuthenticated,
  OrderController.cancelOrder
);

OrderRouter.patch(
  "/update-status/:orderId",
  AuthMiddleware.ensureAuthenticated,
  AuthMiddleware.ensureRole("admin"),
  OrderController.updateOrderStatus
);
export default OrderRouter;
