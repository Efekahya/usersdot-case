import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "./users.service";
import type { User, UserWithOldPassword } from "../types/user";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@Req() request: Request) {
    const { page, pageSize, search, sort, order } = request.query as {
      page?: string;
      pageSize?: string;
      search?: string;
      sort?: string;
      order?: string;
    };
    return this.usersService.getAll(page, pageSize, search, sort, order);
  }

  @Get(":id")
  async getById(@Param("id") id: number) {
    return this.usersService.getById(id);
  }

  @Post("save")
  async insertUsersOne(@Req() request: Request) {
    const body = request.body as User;

    return this.usersService.insertUsersOne(body);
  }

  @Post("update")
  async updateUsersOne(@Req() request: Request) {
    return this.usersService.updateUsersOne(
      request.body as UserWithOldPassword
    );
  }
}
