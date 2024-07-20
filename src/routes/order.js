import express from "express";
import UserController from "../controller/UserController.js";

import "../strategies/local-strategy.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { Order } from "../database/Order.js";
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

OrderRouter.patch(
  "/cancel/:orderId",
  AuthMiddleware.ensureAuthenticated,
  OrderController.cancelOrder
);
export default OrderRouter;
