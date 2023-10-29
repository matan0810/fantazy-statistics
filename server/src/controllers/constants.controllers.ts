import express, { Request, Response } from "express";
import { players, seasonTypes } from "../constants";

export const constantsRouter = express.Router();

constantsRouter.get("/players", async (_req: Request, res: Response) => {
  try {
    res.json(players);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

constantsRouter.get("/seasonTypes", async (_req: Request, res: Response) => {
  try {
    res.json(seasonTypes);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
