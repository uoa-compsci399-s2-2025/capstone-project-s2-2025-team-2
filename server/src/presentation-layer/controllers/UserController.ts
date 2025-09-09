import { User } from "../../business-layer/models/User"
import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Security,
  Request,
} from "tsoa"
import { UserService } from "../../data-layer/repositories/UserRepository"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"

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
  @Security("jwt")
  @SuccessResponse("200", "User email retrieved successfully")
  @Get("me/email")
  public async getEmail(
    @Request() request: AuthRequest,
  ): Promise<{ email: string }> {
    console.log("getting user's email")
    const user = request.user
    return { email: user.email }
  }
}
