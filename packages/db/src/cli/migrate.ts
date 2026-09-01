import { createDatabase } from "../database.js";
import { runMigrations } from "../migrations.js";

const database = createDatabase();
try {
  runMigrations(database);
  console.log(`Migrations applied to ${database.path}`);
} finally {
  database.close();
}
