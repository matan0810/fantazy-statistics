import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fantazy_stats",
  password: "1234",
  port: 5432,
});

export default pool;
