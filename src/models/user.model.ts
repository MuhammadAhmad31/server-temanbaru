import { D1Database } from '@cloudflare/workers-types';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.type';
import { hash } from '../utils/hash';

export class UserModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async findAll(): Promise<User[]> {
    try {
      const { results } = await this.db
        .prepare('SELECT * FROM users ORDER BY created_at DESC')
        .all<User>();
      return results || [];
    } catch (error) {
      console.error('UserModel.findAll error:', error);
      throw new Error('Failed to fetch users from database');
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM users WHERE id = ?')
        .bind(id)
        .first<User>();
      return result || null;
    } catch (error) {
      console.error('UserModel.findById error:', error);
      throw new Error('Failed to fetch user from database');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first<User>();
      return result || null;
    } catch (error) {
      console.error('UserModel.findByEmail error:', error);
      throw new Error('Failed to fetch user by email from database');
    }
  }

  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const { name, email, password } = userData;
      
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const result = await this.db
        .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *')
        .bind(name, email, hash(password))
        .first<User>();
      
      if (!result) {
        throw new Error('Failed to create user');
      }
      
      const { password: _, ...safeUser } = result;
      return safeUser;
    } catch (error) {
      console.error('UserModel.create error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create user in database');
    }
  }

  async update(id: number, userData: UpdateUserRequest): Promise<User | null> {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return null;
      }

      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await this.findByEmail(userData.email);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (userData.name !== undefined) {
        updates.push('name = ?');
        values.push(userData.name);
      }
      if (userData.email !== undefined) {
        updates.push('email = ?');
        values.push(userData.email);
      }

      if (updates.length === 0) {
        return existingUser;
      }

      values.push(id);
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
      
      const result = await this.db
        .prepare(query)
        .bind(...values)
        .first<User>();
      
      return result || null;
    } catch (error) {
      console.error('UserModel.update error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update user in database');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db
        .prepare('DELETE FROM users WHERE id = ?')
        .bind(id)
        .run();
      
      return true;
    } catch (error) {
      console.error('UserModel.delete error:', error);
      throw new Error('Failed to delete user from database');
    }
  }

  async count(): Promise<number> {
    try {
      const result = await this.db
        .prepare('SELECT COUNT(*) as count FROM users')
        .first<{ count: number }>();
      
      return result?.count || 0;
    } catch (error) {
      console.error('UserModel.count error:', error);
      throw new Error('Failed to count users in database');
    }
  }

  async findPaginated(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      const [users, totalResult] = await Promise.all([
        this.db
          .prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?')
          .bind(limit, offset)
          .all<User>()
          .then(result => result.results || []),
        this.count()
      ]);

      return {
        users,
        total: totalResult
      };
    } catch (error) {
      console.error('UserModel.findPaginated error:', error);
      throw new Error('Failed to fetch paginated users from database');
    }
  }
}
