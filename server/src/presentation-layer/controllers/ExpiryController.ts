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
      * Send email notifications to all users who has reagents expiring in 30 days
      * @returns void
      */
     @SuccessResponse("200", "Email notifications sent successfully")
     @Get("/send-expiry-emails")
     public async sendExpiryNotifications(): Promise<void> {
          const expiryReagents = await new ReagentService().getReagentsExpiringSoonAllUsers()

     }

     /**
      * 
      */

      

}