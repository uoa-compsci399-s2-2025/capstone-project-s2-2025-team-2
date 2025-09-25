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
  static getExpiryEmailTemplate(reagents: { name: string; expiryDate: string}[]): string {
    const reagentList = reagents.map(reagent => `
      <li>
        <strong>${reagent.name}</strong> - Expiry Date: ${new Date(reagent.expiryDate).toLocaleDateString()}
      </li>
    `).join('')
    
    return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Dear User</h2>
        <p>You have reagents expiring in 30 days:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${reagentList}</h1>
        </div>
        <p>Please sell, trade or giveaway those reagents, or use them as soon as possible.</p>
      </div>
    `
}

}
