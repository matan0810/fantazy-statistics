import "reflect-metadata";
import { createConnection, Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import express from "express";
import { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001;

@Entity("stats")
class Stat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerName: string;

  @Column()
  points: number;
}

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Fantasy League API is running" });
});

app.get("/api/stats", async (req: Request, res: Response) => {
  const stats = await Stat.find();
  res.json(stats);
});

app.post("/api/stats", async (req: Request, res: Response) => {
  const { playerName, points } = req.body;
  const stat = Stat.create({ playerName, points });
  await stat.save();

  const stats = await Stat.find();
  res.json(stats);
});

createConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to the database:", error));
