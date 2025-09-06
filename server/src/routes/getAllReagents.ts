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
    const snapshot = await reagentService.getAllReagentsRaw();

    const reagents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
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
