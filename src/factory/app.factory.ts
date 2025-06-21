import { D1Database } from "@cloudflare/workers-types";
import { UserModel } from "../models/user.model";
import { UserService } from "../service/user.service";
import { UserController } from "../controllers/user.controller";
import { Controllers } from "../types/app.type";
import { AuthModel } from "../models/auth.model";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controllers/auth.controller";

export class AppFactory {
  private static controllers: Controllers | null = null;
  
  static getControllers(db: D1Database): Controllers {
    if (!this.controllers) {
      // Models
      const userModel = new UserModel(db);
      const authModel = new AuthModel(db);
      // const productModel = new ProductModel(db);
      // const orderModel = new OrderModel(db);

      // Services
      const userService = new UserService(userModel);
      const authService = new AuthService(authModel);
      // const productService = new ProductService(productModel);
      // const orderService = new OrderService(orderModel);

      // Controllers - cached globally
      this.controllers = {
        user: new UserController(userService),
        auth: new AuthController(authService),
        // product: new ProductController(productService),
        // order: new OrderController(orderService)
      };
    }

    return this.controllers;
  }

  static reset(): void {
    this.controllers = null;
  }
}