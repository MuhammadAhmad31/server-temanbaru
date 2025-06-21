import { AuthService } from "../service/auth.service";
import { AppContext } from "../types/app.type";
import { ApiResponseBuilder } from "../types/responseApi.type";
import { CreateUserRequest } from "../types/user.type";
import { UserValidationHelper } from "./helpers/user.helper";
import { sign } from 'hono/jwt';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(c: AppContext) {
    try {
      const body = await c.req.json<CreateUserRequest>();

      // Validate request body
      const validationErrors =
        UserValidationHelper.validateCreateUserRequest(body);
      if (validationErrors.length > 0) {
        const response = ApiResponseBuilder.validationError(
          "Validation failed",
          validationErrors
        );
        return c.json(response, 400);
      }

      const newUser = await this.authService.register(body);

      const response = ApiResponseBuilder.success(
        newUser,
        "User created successfully"
      );
      return c.json(response, 201);
    } catch (error) {
      console.error("UserController.createUser error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      let response;

      if (errorMessage.includes("already exists")) {
        response = ApiResponseBuilder.conflict(errorMessage);
        return c.json(response, 409);
      } else if (
        errorMessage.includes("required") ||
        errorMessage.includes("Invalid")
      ) {
        response = ApiResponseBuilder.validationError(errorMessage, []);
        return c.json(response, 400);
      } else {
        response = ApiResponseBuilder.internalError(errorMessage);
        return c.json(response, 500);
      }
    }
  }

  async login(c: AppContext) {
    try {
      const { email, password } = await c.req.json<{
        email: string;
        password: string;
      }>();

      if (!email || !password) {
        const response = ApiResponseBuilder.validationError(
          "Email and password are required",
          []
        );
        return c.json(response, 400);
      }

      const user = await this.authService.login(email, password);

      if (!user) {
        const response = ApiResponseBuilder.unauthorized("Invalid credentials");
        return c.json(response, 401);
      }

      const secret = c.env.JWT_SECRET;
      const token = await sign(
        { email: user.email }, 
        secret
      );

      const response = ApiResponseBuilder.success(
        { token },
        "Login successful"
      );
      return c.json(response, 200);
    } catch (error) {
      console.error("AuthController.login error:", error);

      const response = ApiResponseBuilder.internalError(
        error instanceof Error ? error.message : "Failed to login"
      );
      return c.json(response, 500);
    }
  }
}
