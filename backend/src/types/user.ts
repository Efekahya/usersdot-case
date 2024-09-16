export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  age: number;
  country: string;
  district: string;
  role: "admin" | "user";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type UserWithoutPassword = Omit<User, "password">;
export type UserWithOldPassword = User & { oldPassword: string };
