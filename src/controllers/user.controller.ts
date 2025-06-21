import { CreateUserRequest, UpdateUserRequest, User } from '../types/user.type';
import { 
  ApiResponseBuilder, 
} from '../types/responseApi.type';
import { UserService } from '../service/user.service';
import { UserValidationHelper } from './helpers/user.helper';
import { AppContext } from '../types/app.type';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(c: AppContext) {
    try {
      const page = parseInt(c.req.query('page') || '1');
      const limit = parseInt(c.req.query('limit') || '10');
      const usePagination = c.req.query('paginate') === 'true';

      if (page < 1 || limit < 1 || limit > 100) {
        const response = ApiResponseBuilder.validationError('Invalid pagination parameters', [
          { field: 'page', message: 'Page must be greater than 0', value: page },
          { field: 'limit', message: 'Limit must be between 1 and 100', value: limit }
        ]);
        return c.json(response, 400);
      }

      if (usePagination) {
        const result = await this.userService.getUsersPaginated(page, limit);
        
        const response = ApiResponseBuilder.successWithPagination(
          result.users,
          page,
          result.totalPages,
          result.total,
          limit,
          'Users retrieved successfully'
        );

        return c.json(response, 200);
      } else {
        const users = await this.userService.getAllUsers();
        
        const response = ApiResponseBuilder.success(
          users,
          'All users retrieved successfully',
          users.length
        );

        return c.json(response, 200);
      }
    } catch (error) {
      console.error('UserController.getAllUsers error:', error);
      
      const response = ApiResponseBuilder.internalError('Failed to fetch users');
      return c.json(response, 500);
    }
  }

  async getUserById(c: AppContext) {
    try {
      const id = parseInt(c.req.param('id'));
      
      if (isNaN(id) || id < 1) {
        const response = ApiResponseBuilder.validationError('Invalid user ID', [
          { field: 'id', message: 'User ID must be a positive number', value: c.req.param('id') }
        ]);
        return c.json(response, 400);
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        const response = ApiResponseBuilder.notFound('User');
        return c.json(response, 404);
      }

      const response = ApiResponseBuilder.success(user, 'User retrieved successfully');
      return c.json(response, 200);
    } catch (error) {
      console.error('UserController.getUserById error:', error);
      
      const response = ApiResponseBuilder.internalError(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
      return c.json(response, 500);
    }
  }

  async createUser(c: AppContext) {
    try {
      const body = await c.req.json<CreateUserRequest>();
      
      // Validate request body
      const validationErrors = UserValidationHelper.validateCreateUserRequest(body);
      if (validationErrors.length > 0) {
        const response = ApiResponseBuilder.validationError('Validation failed', validationErrors);
        return c.json(response, 400);
      }
      
      const newUser = await this.userService.createUser(body);
      
      const response = ApiResponseBuilder.success(newUser, 'User created successfully');
      return c.json(response, 201);
    } catch (error) {
      console.error('UserController.createUser error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      let response;
      
      if (errorMessage.includes('already exists')) {
        response = ApiResponseBuilder.conflict(errorMessage);
        return c.json(response, 409);
      } else if (errorMessage.includes('required') || errorMessage.includes('Invalid')) {
        response = ApiResponseBuilder.validationError(errorMessage, []);
        return c.json(response, 400);
      } else {
        response = ApiResponseBuilder.internalError(errorMessage);
        return c.json(response, 500);
      }
    }
  }

  async updateUser(c: AppContext) {
    try {
      const id = parseInt(c.req.param('id'));
      
      if (isNaN(id) || id < 1) {
        const response = ApiResponseBuilder.validationError('Invalid user ID', [
          { field: 'id', message: 'User ID must be a positive number', value: c.req.param('id') }
        ]);
        return c.json(response, 400);
      }

      const body = await c.req.json<UpdateUserRequest>();
      
      const validationErrors = UserValidationHelper.validateUpdateUserRequest(body);
      if (validationErrors.length > 0) {
        const response = ApiResponseBuilder.validationError('Validation failed', validationErrors);
        return c.json(response, 400);
      }
      
      const updatedUser = await this.userService.updateUser(id, body);
      
      if (!updatedUser) {
        const response = ApiResponseBuilder.notFound('User');
        return c.json(response, 404);
      }

      const response = ApiResponseBuilder.success(updatedUser, 'User updated successfully');
      return c.json(response, 200);
    } catch (error) {
      console.error('UserController.updateUser error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      let response;
      
      if (errorMessage.includes('already exists')) {
        response = ApiResponseBuilder.conflict(errorMessage);
        return c.json(response, 409);
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('required')) {
        response = ApiResponseBuilder.validationError(errorMessage, []);
        return c.json(response, 400);
      } else {
        response = ApiResponseBuilder.internalError(errorMessage);
        return c.json(response, 500);
      }
    }
  }

  async deleteUser(c: AppContext) {
    try {
      const id = parseInt(c.req.param('id'));
      
      if (isNaN(id) || id < 1) {
        const response = ApiResponseBuilder.validationError('Invalid user ID', [
          { field: 'id', message: 'User ID must be a positive number', value: c.req.param('id') }
        ]);
        return c.json(response, 400);
      }

      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        const response = ApiResponseBuilder.notFound('User');
        return c.json(response, 404);
      }

      const response = ApiResponseBuilder.success(
        { id, deleted: true }, 
        'User deleted successfully'
      );
      return c.json(response, 200);
    } catch (error) {
      console.error('UserController.deleteUser error:', error);
      
      const response = ApiResponseBuilder.internalError(
        error instanceof Error ? error.message : 'Failed to delete user'
      );
      return c.json(response, 500);
    }
  }

}