import {
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Security,
  Request,
  Path,
  Body,
  Tags,
  Query,
} from "tsoa"
import { Wanted } from "../../business-layer/models/Wanted"
import { WantedService } from "../../data-layer/repositories/WantedRepository"
import { ReagentCategory } from "../../business-layer/models/Reagent"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"
import { CreateWantedRequest } from "../../service-layer/dtos/request/CreateWantedRequest"

@Tags("Wanted")
@Route("wanted")
export class WantedController extends Controller {
     /**
      * Get all wanted reagents with an option to filter them by category.
      * 
      * @param category - The list of all categories to fetch wanted reagents from.
      * @returns Promise<Wanted[]> - The list of wanted reagents filtered.
      */
     @SuccessResponse("200", "All wanted reagents returned successfully")
     @Get()
     public async getAllWantedReagents(
          @Query() category?: ReagentCategory[],
     ):Promise<Wanted[]> {
          if (category) {
               const wanted = await new WantedService().getWantedReagentsByCategory(
                    category,
               )
               return wanted
          }
          const wanted = await new WantedService().getAllWantedReagents()
          return wanted
     }

     /**
      * Get a wanted reagent by its ID.
      * 
      * @param id - The ID of the wanted reagent to retrieve.
      * @returns Promise<Wanted> - The wanted reagent with its ID.
      * @throws 404 - If the reagent with the specified ID does not exist.
      */
     @SuccessResponse("200", "Wanted reagents retrieved successfully")
     @Get("{id}")
     public async getWantedReagentById(@Path() id: string): Promise<Wanted> {
          const wanted = await new WantedService().getWantedReagentById(id)
          if (wanted === null) {
               this.setStatus(404)
               return undefined
          }
          return wanted
     }

     /**
      * Create a reagent by passing in all the required props.
      * User must be authenticated to access this endpoint (lab manager / admin)
      * @param request - The request object containing the data
      * @param id - The ID of the new wanted reagent being created.
      */

     @SuccessResponse("201", "Wanted reagent created successfully")
     @Security("jwt")
     @Post()
     public async createWantedReagent(
          @Request() request:AuthRequest,
          @Body() requestObject: CreateWantedRequest,
     ): Promise<Wanted> {
          const user = request.user
          if (!user || !["admin", "lab_manager"].includes(user.role)) {
               console.error("You don't have permission to create reagents")
               throw new Error("Forbidden")
          }
          const user_id = request.user.uid
          const data =  {
               ...requestObject,
               user_id,
          }
          const newWanted = await new WantedService().createWanted(data as Wanted)
          return newWanted
     }
}