import { Injectable, Logger } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { DatabaseService } from "src/db/db.service";
import * as bcrypt from "bcrypt";

const generateSetString = (user: Partial<User>) => {
  const keys = Object.keys(user);
  return keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");
};

@Injectable()
export class UsersService {
  constructor(private client: DatabaseService) {}
  private readonly logger = new Logger("UsersService");

  async getAll(
    page: string = "0",
    pageSize: string = "20",
    search: string = ""
  ): Promise<Omit<User, "password">[]> {
    const offset = parseInt(page) * parseInt(pageSize);
    const nan = isNaN(offset);

    if (nan) {
      this.logger.error(
        `Invalid page or pageSize: ${page}, ${pageSize}. Using defaults.`
      );
    }

    const searchables = ["name", "surname", "email", "country", "district"];
    const searchQuery = searchables.map(s => `${s} ILIKE $1`).join(" OR ");

    const query = {
      text: `SELECT * FROM users WHERE ${searchQuery} OFFSET $2 LIMIT $3`,
      values: [`%${search}%`, offset, pageSize]
    };

    return this.client
      .query<User[]>(query.text, query.values)
      .then(res =>
        res.data.map((row: User) => ({ ...row, password: undefined }))
      );
  }

  async getById(id: number): Promise<Omit<User, "password">> {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id]
    };

    return this.client.query<User[]>(query.text, query.values).then(res => {
      if (res.data.length === 0) {
        return null;
      }

      return { ...res.data[0], password: undefined };
    });
  }

  async insertUsersOne(
    user: Omit<User, "id">
  ): Promise<Omit<User, "password"> | string> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
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

    const res = await this.client.query<User>(query.text, query.values);

    if (res.success) {
      return { ...res.data[0], password: undefined };
    }

    return res.error;
  }

  async updateUsersOne(
    id: number,
    user: Partial<User>
  ): Promise<Omit<User, "password"> | string> {
    const query = {
      text: `UPDATE users SET ${generateSetString(user)} WHERE id = $${Object.keys(user).length + 1} RETURNING *`,
      values: [...Object.values(user), id]
    };

    const res = await this.client.query<User>(query.text, query.values);

    if (res.success) {
      return { ...res.data[0], password: undefined };
    }

    return res.error;
  }
}
