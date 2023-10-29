import express, { Request, Response } from "express";
import pool from "../db";

export const seasonsRouter = express.Router();

// GET all seasons
seasonsRouter.get("/seasons", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM seasons order by year");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new season
seasonsRouter.post("/seasons", async (req: Request, res: Response) => {
  const { year, type } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO seasons (year, type) VALUES ($1, $2) RETURNING *",
      [year, type]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding season:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a season by ID
seasonsRouter.delete("/seasons/:id", async (req: Request, res: Response) => {
  const seasonId = req.params.id;
  try {
    await pool.query("DELETE FROM seasons WHERE id = $1", [seasonId]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting season:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
