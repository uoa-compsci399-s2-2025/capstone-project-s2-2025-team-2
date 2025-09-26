import EmailService from "../../service-layer/services/EmailService"
import { ReagentService } from "../../data-layer/repositories/ReagentRepository"
import { UserService } from "../../data-layer/repositories/UserRepository"
import { Controller, Get, Route, SuccessResponse, Tags} from "tsoa"

@Tags("Expiry")
@Route("Expiry")
export class ExpiryController extends Controller {
  /**
   * Send email notifications to all users who has reagents expiring in 30 days
   * @returns void
   */
  @SuccessResponse("200", "Email notifications sent successfully")
  @Get("/send-expiry-emails")
  public async sendExpiryNotifications(): Promise<void> {
    try {
      const ExpiryReagentsWithUser =
        await new ReagentService().getReagentsExpiringSoonAllUsers()
      for (const [user_id, reagents] of Object.entries(ExpiryReagentsWithUser)) {
        const user = await new UserService().getUserById(user_id)
        if (user && user.email && reagents.length > 0) {
          await new EmailService().sendReagentExpiryEmail(user.email, reagents)
        }
      }
    } catch (error) {
      console.error("Error sending expiry notifications:", error)
      throw new Error("Failed to send expiry notifications")
    }
  }
}
