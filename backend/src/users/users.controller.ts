import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { User } from "./interfaces/user.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@Req() request: Request) {
    const { page, pageSize, search } = request.query as {
      page?: string;
      pageSize?: string;
      search?: string;
    };
    return this.usersService.getAll(page, pageSize, search);
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
    const { id, ...body } = request.body as User;
    return this.usersService.updateUsersOne(id, body);
  }
}
