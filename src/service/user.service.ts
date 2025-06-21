import { UserModel } from "../models/user.model";
import { CreateUserRequest, UpdateUserRequest, User } from "../types/user.type";

export class UserService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }
    return await this.userModel.findById(id);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.validateUserData(userData);

    return await this.userModel.create(userData);
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<User | null> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }

    if (userData.email) {
      this.validateEmail(userData.email);
    }
    if (userData.name) {
      this.validateName(userData.name);
    }

    return await this.userModel.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }
    return await this.userModel.delete(id);
  }

  async getUsersPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    if (page <= 0) page = 1;
    if (limit <= 0 || limit > 100) limit = 10;

    const result = await this.userModel.findPaginated(page, limit);

    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  private validateUserData(userData: CreateUserRequest): void {
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!userData.email || userData.email.trim().length === 0) {
      throw new Error("Email is required");
    }

    this.validateName(userData.name);
    this.validateEmail(userData.email);
  }

  private validateName(name: string): void {
    if (name.length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
    if (name.length > 100) {
      throw new Error("Name must be less than 100 characters");
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (email.length > 255) {
      throw new Error("Email must be less than 255 characters");
    }
  }
}
