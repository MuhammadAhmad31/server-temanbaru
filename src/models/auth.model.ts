import { D1Database } from "@cloudflare/workers-types";
import { CreateUserRequest, User } from "../types/user.type";
import { hash } from "../utils/hash";

export class AuthModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async register(user: CreateUserRequest): Promise<User> {
    try {
      const { name, email, password } = user;

      const existingUser = await this.db
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(email)
        .first<User>();

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await hash(password);

      const result = await this.db
        .prepare(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *"
        )
        .bind(name, email, hashedPassword)
        .run();

      const userResult = result.results[0] as Record<string, unknown>;
      const { password: _, ...safeUser } = userResult;

      return safeUser as unknown as User;
    } catch (error) {
      console.error("AuthModel.register error:", error);
      throw new Error("Failed to register user");
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<Omit<User, "password"> | null> {
    try {
      const hashedPassword = await hash(password);

      const user = await this.db
        .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
        .bind(email, hashedPassword)
        .first<User>();

      if (!user) return null;

      const { password: _, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      console.error("AuthModel.login error:", error);
      throw new Error("Failed to login user");
    }
  }
}
