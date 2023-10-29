import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ?? 3001;

export const DB_CREDENTIALS = {
  user: process.env.DB_USER ?? "postgres",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_NAME ?? "fantazy_stats",
  password: process.env.DB_PASSWORD ?? "1234",
  port: parseInt(process.env.DB_PORT ?? "5432"),
};
