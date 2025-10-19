/**
 * Migration script to update Firestore documents' `type` field (or another field)
 * Usage (recommended via PowerShell):
 *  $env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\serviceAccount.json'
 *  pnpm --filter server -w dlx ts-node server/scripts/update-order-type.ts --collection=offers --from=order --to=exchange --dryRun
 *
 * Or compile and run with node after tsc build.
 *
 * The script supports a dry-run mode (logs changes it would make). It updates documents in batches
 * and is careful not to overwrite other fields.
 */

import admin from "firebase-admin"

type Args = {
  collection: string
  from: string
  to: string
  field?: string
  dryRun: boolean
  limit?: number
}

function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const out: any = { collection: "offers", from: "order", to: "order", field: "type", dryRun: true }
  argv.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [k, v] = arg.replace(/^--/, "").split("=")
      if (k === "dryRun") out.dryRun = v === undefined ? true : v === "true"
      else if (k === "collection") out.collection = v
      else if (k === "from") out.from = v
      else if (k === "to") out.to = v
      else if (k === "field") out.field = v
      else if (k === "limit") out.limit = Number(v)
    }
  })
  return out
}

async function main() {
  const args = parseArgs()

  // Initialize admin SDK. Use GOOGLE_APPLICATION_CREDENTIALS env var locally.
  if (!admin.apps.length) {
    try {
      admin.initializeApp()
    } catch (err) {
      console.error("Failed to initialize firebase-admin. Make sure GOOGLE_APPLICATION_CREDENTIALS is set or the environment has credentials.", err)
      process.exit(1)
    }
  }

  const db = admin.firestore()
  console.log("Migration settings:", args)

  const collRef = db.collection(args.collection)

  // Build query for docs where field === from
  let query: FirebaseFirestore.Query = collRef.where(args.field || "type", "==", args.from)
  if (args.limit && args.limit > 0) query = query.limit(args.limit)

  const snapshot = await query.get()
  console.log(`Found ${snapshot.size} documents in '${args.collection}' where ${args.field} === '${args.from}'`)

  if (snapshot.empty) {
    console.log("Nothing to do.")
    return
  }

  // Prepare batches of 500
  const batches: FirebaseFirestore.WriteBatch[] = []
  let currentBatch = db.batch()
  let opCount = 0
  let batchCount = 0

  for (const doc of snapshot.docs) {
    const id = doc.id
    const data = doc.data()
    console.log(`Doc: ${id} -> current ${args.field}='${data[args.field || "type"]}'`)
    if (args.dryRun) continue

    currentBatch.update(doc.ref, { [args.field || "type"]: args.to })
    opCount++
    if (opCount >= 500) {
      batches.push(currentBatch)
      currentBatch = db.batch()
      opCount = 0
      batchCount++
    }
  }

  if (!args.dryRun) {
    if (opCount > 0) batches.push(currentBatch)
    console.log(`Committing ${batches.length} batch(es)`)
    for (let i = 0; i < batches.length; i++) {
      console.log(`Committing batch ${i + 1}/${batches.length}`)
      await batches[i].commit()
    }
    console.log("Migration complete.")
  } else {
    console.log("Dry run complete. No changes were written.")
  }
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
