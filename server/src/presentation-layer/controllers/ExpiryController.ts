import EmailService from "service-layer/services/EmailService";
import { ReagentService } from "data-layer/repositories/ReagentRepository";
import { UserService } from "data-layer/repositories/UserRepository";

import {
  Controller,
  Get,

  Route,
  SuccessResponse,



  Tags,

  Path,
} from "tsoa"


@Tags("Expiry")
@Route("Expiry")
export class ExpiryController extends Controller {

          private emailService: EmailService
          private reagentService: ReagentService
          private userService: UserService


     /**
      * Check if this user has any reagents expiring in 30 days by their id.
      */
     @SuccessResponse("200", "User regents retrieved successfully")
     @Get("{user_id}/expiry")
     public async checkUserReagentExpiry(@Path() user_id: string): Promise<void> {
          const user = await this.userService.getUserById(user_id);
          try {
               const expiringReagents = await this.reagentService.getReagentsExpiringSoon(user_id);
               if (expiringReagents.length > 0) {
                    await this.emailService.sendReagentExpiryEmail(user.email, expiringReagents);
                    console.log(`Sent expiry email to ${user.email}`);
               } else {
                    console.log(`No expiring reagents for user ${user.email}`);
               }
          } catch (error) {
               throw new Error(`Failed to check reagents for user ${user.email}`);
          }
     }

}