import "dotenv/config"
import EmailService from "./server/src/service-layer/services/EmailService"
import { Reagent } from "./server/src/data-layer/models/Reagent"

async function main() {
  const emailService = new EmailService()

  const testReagents: Reagent[] = [
    { name: "Acetone", expiryDate: "2025-10-30" } as Reagent,
    { name: "Ethanol", expiryDate: "2025-11-05" } as Reagent,
  ]

  await emailService.sendReagentExpiryEmail(
    "your-email@example.com",
    testReagents,
  )

  console.log("✅ Test email sent (check your inbox or Ethereal preview URL)")
}

main().catch(console.error)
// To run this test, use the command: npx ts-node --project tsconfig.test.json testEmail.ts
