import nodemailer from "nodemailer"
import { EmailTemplates } from "../../utils/EmailTemplates"

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
}
