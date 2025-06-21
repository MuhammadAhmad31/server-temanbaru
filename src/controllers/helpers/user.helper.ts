import { ErrorDetail } from "../../types/responseApi.type";
import { CreateUserRequest, UpdateUserRequest } from "../../types/user.type";


export class UserValidationHelper {
  /**
   * Validate create user request
   */
  static validateCreateUserRequest(body: CreateUserRequest): ErrorDetail[] {
    const errors: ErrorDetail[] = [];

    // Validate name
     if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0 || body.password.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Name is required and must be a non-empty string',
        value: body.name
      });
    }

    if (!body.email || typeof body.email !== 'string') {
      errors.push({
        field: 'email',
        message: 'Email is required and must be a string',
        value: body.email
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({
        field: 'email',
        message: 'Email must be a valid email address',
        value: body.email
      });
    }

    return errors;
  }

  /**
   * Validate update user request
   */
  static validateUpdateUserRequest(body: UpdateUserRequest): ErrorDetail[] {
    const errors: ErrorDetail[] = [];

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        errors.push({
          field: 'name',
          message: 'Name must be a non-empty string',
          value: body.name
        });
      } else if (body.name.trim().length < 2) {
        errors.push({
          field: 'name',
          message: 'Name must be at least 2 characters long',
          value: body.name
        });
      } else if (body.name.trim().length > 100) {
        errors.push({
          field: 'name',
          message: 'Name must not exceed 100 characters',
          value: body.name
        });
      }
    }

    if (body.email !== undefined) {
      if (typeof body.email !== 'string') {
        errors.push({
          field: 'email',
          message: 'Email must be a string',
          value: body.email
        });
      } else if (!this.isValidEmail(body.email)) {
        errors.push({
          field: 'email',
          message: 'Email must be a valid email address',
          value: body.email
        });
      }
    }

    return errors;
  }


  /**
   * Check if email is valid
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

}