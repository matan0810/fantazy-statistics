import express, { Request, Response } from "express";
import pool from "../db";

export const teamsRouter = express.Router();

teamsRouter.get("/teams", async (req: Request, res: Response) => {
  const {
    query: { season },
  } = req;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM teams WHERE season_id = $1 ORDER BY location",
      [season]
    );
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

teamsRouter.post("/teams", async (req: Request, res: Response) => {
  const { seasonId, player, location, points } = req.body;

  if (seasonId && player && location && points) {
    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO teams (season_id, player, location, points) VALUES ($1, $2, $3, $4)",
        [seasonId, player, location, points]
      );

      client.release();

      console.log("Statistics added successfully: " + player);
      res.json({ message: "Statistics added successfully" });
    } catch (error) {
      console.error("Error adding statistics:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Invalid data" });
  }
});
