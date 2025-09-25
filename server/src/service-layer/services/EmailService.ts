import nodemailer from "nodemailer"
import { EmailTemplates } from "../../utils/EmailTemplates"
import { Reagent } from "business-layer/models/Reagent"

export default class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    })
  }

  public async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code",
      html: EmailTemplates.getVerificationEmailTemplate(verificationCode),
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error("Error sending email:", error)
      throw new Error("Failed to send verification email")
    }
  }

/**   
 * Sends an email notification to the user about reagents expiring in 30 days.
   *
   * @param email - The email address of the user to notify.
   * @param reagents - An array of reagents that are expiring in 30 days.
   */


  public async sendReagentExpiryNotification(
    email: string,
    reagents: Reagent[]): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reagent Expiry Alert - You have reagents expiring in 30 Days",
      html: EmailTemplates.getExpiryEmailTemplate(reagents),
    }
    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error("Error sending email:", error)
      throw new Error("Failed to send reagent expiry notification email")
    }
}


}