import { User } from "../../data-layer/models/models";
import {
  UserCreationParams,
  UserService,
} from "../../data-layer/services/UserService";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";

@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<User> {
    return new UserService().get(userId, name);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<User> {
    this.setStatus(201); // set return status 201
    return new UserService().create(requestBody);
  }

  @Delete("{userId}")
  public async deleteUser(@Path() userId: number): Promise<void> {
    await new UserService().delete(userId);
  }

  @Get()
  public async getAllUsers(): Promise<User[]> {
    return new UserService().getAll();
  }
}
