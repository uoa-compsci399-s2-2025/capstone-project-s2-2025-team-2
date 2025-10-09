export class EmailTemplates {
  static getVerificationEmailTemplate(verificationCode: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verification Code</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  }
  static getExpiryEmailTemplate(
    username: string,
    reagents: { name: string; expiryDate: string }[],
  ): string {
    const reagentList = reagents
      .map(
        (reagent) => `
    <div>
      <strong>${reagent.name}</strong> - Expiry Date: ${new Date(reagent.expiryDate).toLocaleDateString()}
    </div>
  `,
      )
      .join("")

    // Handle pluralization
    const reagentCount = reagents.length
    const reagentWord = reagentCount === 1 ? "reagent" : "reagents"
    const verbForm = reagentCount === 1 ? "expires" : "expire"
    const pronounForm = reagentCount === 1 ? "it" : "them"

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Dear ${username}:</h2>
      <p style="color: #333;">You have ${reagentCount} ${reagentWord} ${verbForm === "expires" ? "expiring" : "expiring"} in 30 days:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h5 style="color: #333; font-size: 16px; margin: 0; letter-spacing: 1px;">${reagentList}</h5>
      </div>
      <p style="color: #333;">Please sell, trade or giveaway ${reagentCount === 1 ? "this reagent" : "those reagents"}, or use ${pronounForm} as soon as possible.</p>
    </div>
  `
  }
}
