import express, { Request, Response } from "express";
import pool from "../db";

export const teamsRouter = express.Router();

teamsRouter.get("/teams", async (req: Request, res: Response) => {
  const {
    query: { season, seasonType },
  } = req;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT *
      FROM teams 
      RIGHT JOIN seasons ON teams.season_id=seasons.id
      WHERE seasons.id = $1 AND seasons.type = $2
      ORDER BY location`,
      [season, seasonType]
    );
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

teamsRouter.post("/teams", async (req: Request, res: Response) => {
  const { seasonId, player, location, points, team_name } = req.body;

  if (seasonId && player && location && points) {
    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO teams (season_id, player, location, points, team_name) VALUES ($1, $2, $3, $4, $5)",
        [seasonId, player, location, points, team_name]
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
