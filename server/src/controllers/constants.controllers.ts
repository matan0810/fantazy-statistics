import express from "express";
import { players, seasonTypes } from "../constants";

export const constantsRouter = express.Router();

constantsRouter.get("/players", async (_req: any, res: any) => {
  try {
    res.json(players);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

constantsRouter.get("/seasonTypes", async (_req: any, res: any) => {
  try {
    res.json(seasonTypes);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
