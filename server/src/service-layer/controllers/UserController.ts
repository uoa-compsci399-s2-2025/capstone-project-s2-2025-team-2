import { User } from "data-layer/models/models"
import { Controller, Get, Path, Route, SuccessResponse } from "tsoa"
import { UserService } from "../../data-layer/services/UserService"
@Route("users")
export class UserController extends Controller {
  private userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  @SuccessResponse("200", "Found")
  @Get("{userId}")
  public async getUser(@Path() id: string): Promise<User | null> {
    const user = await this.userService.getUser(id)
    return user
  }
}
