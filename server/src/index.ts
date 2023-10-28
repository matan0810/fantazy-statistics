import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";
import { players, seasonTypes } from "./constants";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fantazy_stats",
  password: "1234",
  port: 5432,
});

// Endpoint to get a list of statistics
app.get("/api", async (_req: any, res: any) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM stats");
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to add new statistics
app.post("/api", async (req: any, res: any) => {
  const { season, seasonType, player, location, points } = req.body;

  if (season && seasonType && player && location && points) {
    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO stats (season, season_type, player, location, points) VALUES ($1, $2, $3, $4, $5)",
        [season, seasonType, player, location, points]
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

app.get("/api/players", async (_req: any, res: any) => {
  try {
    res.json(players);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/seasonTypes", async (_req: any, res: any) => {
  try {
    res.json(seasonTypes);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
