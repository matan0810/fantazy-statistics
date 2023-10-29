import { Pool } from "pg";
import { DB_CREDENTIALS } from "./environment";

export const pool = new Pool(DB_CREDENTIALS);

export default pool;
