import { User } from "./user";
import { FetchResult } from ".";

export type GetAllUsersResult = FetchResult<{
  users: User[];
  count: number;
  pageCount: number;
}>;
