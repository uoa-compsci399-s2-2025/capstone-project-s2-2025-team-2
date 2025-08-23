import { Reagent, ReagentCategory } from "../../data-layer/models/Reagent"
import {
  Controller,
  Get,
  Post,
  Path,
  Route,
  SuccessResponse,
  Query,
} from "tsoa"
import { ReagentService } from "../../data-layer/services/ReagentService"
import { CreateReagentRequest } from "service-layer/controllers/request-models/ReagentRequest"

@Route("reagents")
export class ReagentController extends Controller {
  /**
   * Get all reagents with an option to filter them by category.
   *
   * @param category - The list of all categories to fetch reagents from.
   * @returns Promise<Reagent[]> - The list of all reagents filtered.
   */
  @SuccessResponse("200", "Reagents retrieved successfully")
  @Get()
  public async getAllReagents(
    @Query() category?: ReagentCategory[],
  ): Promise<Reagent[]> {
    if (category) {
      const reagents = await new ReagentService().getReagentsByCategory(
        category,
      )
      return reagents
    }
    const reagents = await new ReagentService().getAllReagents()
    return reagents
  }

  /**
   * Get a reagent by its ID.
   *
   * @param id - The ID of the reagent to retrieve.
   * @returns Promise<Reagent> - The reagent with the specified ID.
   * @throws 404 - If the reagent with the specified ID does not exist.
   */
  @SuccessResponse("200", "Reagent retrieved successfully")
  @Get("{id}")
  public async getReagent(@Path() id: string): Promise<Reagent> {
    const reagent = await new ReagentService().getReagentsById(id)
    if (reagent === null) {
      this.setStatus(404)
      return undefined
    }
    return reagent
  }

  @SuccessResponse("201", "Reagent created successfully")
  @Post("{id}")
  public async createReagent(
    @Query() requestObject: CreateReagentRequest,
    @Path() id: string,
  ): Promise<Reagent> {
    // AuthSerice should be used to get the userId
    const reagentToCreate: Reagent = {
      ...requestObject,
      categories: requestObject.categories as ReagentCategory[],
    }
    const newReaget = await new ReagentService().createReagent(
      id,
      reagentToCreate,
    )
    return newReaget
  }
}
