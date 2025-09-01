import { User } from "../../data-layer/models/User"
import { Controller, Get, Route, SuccessResponse } from "tsoa"
import { UserService } from "../../data-layer/repository/UserRepository"
@Route("users")
export class UserController extends Controller {
  @SuccessResponse("200", "Users retrieved successfully")
  @Get()
  public async getAllUsers(): Promise<User[]> {
    console.log("Getting all users...")
    const users = await new UserService().getAllUsers()
    console.log(`Returning ${users.length} users`)
    return users
  }
}
