import { User } from "../../data-layer/models/User"
import { Controller, Get, Route, SuccessResponse, Security, Query } from "tsoa"
import { UserService } from "../../data-layer/services/UserService"
import { ReagentService } from "../../data-layer/services/ReagentService"
import { Reagent } from "../../data-layer/models/Reagent"
import { ReagentCategory } from "../../data-layer/models/Reagent"

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

  /**
   * Get all reagents with an option to filter them by category.
   * User must be authenticated to access this endpoint
   * @param category - The list of all categories to fetch reagents from.
   * @returns Promise<Reagent[]> - The list of all reagents filtered.
   */
  @SuccessResponse("200", "All reagents returned successfully")
  @Get("/reagents")
  @Security("jwt")
  public async getReagents(
    @Query() category?: ReagentCategory[],
  ): Promise<Reagent[]> {
    try {
      if (category) {
        const reagents = await new ReagentService().getReagentsByCategory(
          category,
        )
        return reagents
      }
      const reagents = await new ReagentService().getAllReagents()
      return reagents
    } catch (err) {
      throw new Error("Failed to fetch reagents: " + (err as Error).message)
    }
  }
}
