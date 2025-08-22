import { Reagent, ReagentCategory } from "../../data-layer/models/Reagents"
import { Controller, Get, Path, Route, SuccessResponse, Query } from "tsoa"
import { ReagentService } from "../../data-layer/services/ReagentService";

@Route("reagents")
export class ReagentController extends Controller {
     @SuccessResponse("200", "Reagents retrieved successfully")
     @Get()
     public async getAllReagents(@Query() category?:ReagentCategory[]):Promise<Reagent[]>{
          if (category) {

               const reagents = await new ReagentService().getReagentsByCategory(category);
               return reagents;
          }
          const reagents = await new ReagentService().getAllReagents()
          return reagents;
     }

     @SuccessResponse("200", "Reagent retrieved successfully")
     @Get("{id}")
     public async getReagent(@Path() id:string):Promise<Reagent>{
          const reagent = await new ReagentService().getReagentsById(id)
          if (reagent === null){
               this.setStatus(404)
               return undefined;          
          }
          return reagent;
     }
}



