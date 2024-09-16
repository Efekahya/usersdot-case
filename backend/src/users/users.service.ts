import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/db/db.service";
import * as bcrypt from "bcrypt";
import { QueryResult } from "src/types";
import type {
  User,
  UserWithOldPassword,
  UserWithoutPassword
} from "../types/user";

const generateSetString = (user: Partial<User>) => {
  const keys = Object.keys(user);
  return keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");
};

type GetAllResult = QueryResult<{
  users: UserWithoutPassword[];
  count: number;
  pageCount: number;
}>;
@Injectable()
export class UsersService {
  constructor(private client: DatabaseService) {}
  private readonly logger = new Logger("UsersService");

  async getAll(
    page: string = "0",
    pageSize: string = "20",
    search: string = ""
  ): Promise<GetAllResult> {
    const offset = parseInt(page) * parseInt(pageSize);
    const nan = isNaN(offset);

    if (nan) {
      this.logger.error(
        `Invalid page or pageSize: ${page}, ${pageSize}. Using defaults.`
      );
    }

    const searchables = ["name", "surname", "email", "country", "district"];
    const searchQuery = searchables.map(s => `${s} ILIKE $1`).join(" OR ");

    const countQuery = {
      text: `SELECT COUNT(*) FROM users WHERE ${searchQuery}`,
      values: [`%${search}%`]
    };

    const countRes = await this.client.query<{ count: number }>(
      countQuery.text,
      countQuery.values
    );

    if (!countRes.success) {
      return countRes as GetAllResult;
    }

    const count = countRes.data[0].count;

    const query = {
      text: `SELECT * FROM users WHERE ${searchQuery} ORDER BY id OFFSET $2 LIMIT $3`,
      values: [`%${search}%`, offset, pageSize]
    };

    const res = await this.client.query<User>(query.text, query.values, data =>
      data.map(user => ({ ...user, password: undefined }))
    );

    if (res.success) {
      return {
        success: true,
        data: {
          users: res.data,
          count,
          pageCount: Math.ceil(count / parseInt(pageSize))
        }
      };
    }

    return res as GetAllResult;
  }

  async getById(id: number): Promise<QueryResult<UserWithoutPassword>> {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id]
    };

    const res = await this.client.query<User>(query.text, query.values, data =>
      data.map(user => ({ ...user, password: undefined }))
    );

    return res as QueryResult<UserWithoutPassword>;
  }

  async insertUsersOne(
    user: Omit<User, "id">
  ): Promise<QueryResult<UserWithoutPassword>> {
    let hashedPassword: string;

    try {
      hashedPassword = await bcrypt.hash(user.password, 10);
    } catch (error) {
      return { success: false, error: error.message };
    }

    const query = {
      text: `INSERT INTO users (name, surname, email, password, age, country, district, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      values: [
        user.name,
        user.surname,
        user.email,
        hashedPassword,
        user.age,
        user.country,
        user.district,
        user.role
      ]
    };

    const res = await this.client.query<User>(
      query.text,
      query.values,
      data => ({ ...data, password: undefined })
    );

    return res as QueryResult<UserWithoutPassword>;
  }

  async updateUsersOne(
    user: Partial<UserWithOldPassword>
  ): Promise<QueryResult<UserWithoutPassword>> {
    const userCopy = { ...user };
    delete userCopy.id;
    delete userCopy.oldPassword;
    delete userCopy.createdAt;
    delete userCopy.updatedAt;

    const keys = Object.keys(userCopy);

    if (keys.length === 0) {
      return { success: false, error: "No fields to update" };
    }

    if (user.id === undefined) {
      return { success: false, error: "No id provided" };
    }

    if (user.password && !user.oldPassword) {
      return {
        success: false,
        error: "Old password is required to change password"
      };
    }

    if (user.password) {
      const passwordQuery = {
        text: "SELECT password FROM users WHERE id = $1",
        values: [user.id]
      };

      const passwordRes = await this.client.query<{ password: string }>(
        passwordQuery.text,
        passwordQuery.values
      );

      if (!passwordRes.success) {
        return passwordRes as QueryResult<UserWithoutPassword>;
      }

      const password = passwordRes.data[0].password;

      if (!(await bcrypt.compare(user.oldPassword, password))) {
        return { success: false, error: "Old password is wrong" };
      }

      userCopy.password = await bcrypt.hash(user.password, 10);
    }

    const query = {
      text: `UPDATE users SET ${generateSetString(userCopy)} WHERE id = ${user.id} RETURNING *`,
      values: Object.values(userCopy)
    };

    const res = await this.client.query<User[]>(
      query.text,
      query.values,
      data => data.map(user => ({ ...user, password: undefined }))
    );

    if (res.success && res.data.length === 0) {
      return { success: false, error: "User not found" };
    }

    return res as QueryResult<UserWithoutPassword>;
  }
}
