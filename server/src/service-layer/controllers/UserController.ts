import { User } from "data-layer/models/models"
import { Controller, Get, Route, SuccessResponse } from "tsoa"
import { UserService } from "../../data-layer/services/UserService"
@Route("users")
export class UserController extends Controller {
  private userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  @SuccessResponse("200", "Found")
  @Get("{username}")
  public async getUser(username: string): Promise<User | null> {
    const user = await this.userService.getUser(username)
    return user
  }
}
