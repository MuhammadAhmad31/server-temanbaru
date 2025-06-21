import { AuthModel } from "../models/auth.model";
import { CreateUserRequest, User } from "../types/user.type";

export class AuthService {
    private authModel: AuthModel;

    constructor(authModel: AuthModel) {
        this.authModel = authModel;
    }

    async register(user: CreateUserRequest): Promise<User> {
        return await this.authModel.register(user);
    }

    async login(email: string, password: string): Promise<User | null> {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        return await this.authModel.login(email, password);
    }
}