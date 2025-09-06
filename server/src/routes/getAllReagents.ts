import express from "express";
import { ReagentService } from "../data-layer/services/ReagentService";

const router = express.Router();
const reagentService = new ReagentService();

// router.get("/api/getAllReagents", async (req, res) => {
//   try {
//     const reagents = await reagentService.getAllReagents();
//     res.json(reagents);
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/api/getAllReagents", async (req, res) => {
  try {
    // Get raw Firestore snapshot
    const snapshot = await reagentService.getAllReagentsRaw(); // see note below

    // Map each doc to include id and createdAt
    const reagents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,                   // unique key for React
        createdAt: data.createdAt || null, // fallback if missing
        ...data,
      };
    });

    res.json(reagents);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
