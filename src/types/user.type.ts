export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  password: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}