import cron from "node-cron"
import { ExpiryController } from "../../presentation-layer/controllers/ExpiryController"
import { ReagentController } from "../../presentation-layer/controllers/ReagentController"
export class ScheduleService {
  /**
   * Schedules the sending of expiry notification emails to users every day at 9 AM.
   */
  public scheduleExpiryEmails(): void {
    cron.schedule(
      "0 11 * * *",
      async () => {
        try {
          await new ExpiryController().sendExpiryNotifications()
        } catch (error) {
          console.error("Error sending expiry notification emails:", error)
        }
      },
      {
        timezone: "Pacific/Auckland",
      },
    )
    console.log(
      "Scheduler started - expiry notifications will run daily at 9:00 AM",
    )
  }

  /**
   * Schedules to turn reagent private after expiry date everyday at midnight.
   */
  public scheduleTurnExpiredReagentPrivate(): void {
    cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          await new ReagentController().turnExpiredReagentsPrivate()
        } catch (error) {
          console.error("Error turning reagents private after expiry:", error)
        }
      },
      {
        timezone: "Pacific/Auckland",
      },
    )
    console.log(
      "Scheduler started - turning reagents private after expiry will run daily at midnight",
    )
  }
}
