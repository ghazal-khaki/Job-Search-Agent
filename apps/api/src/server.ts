import { createDatabase, runMigrations } from "@job-search-agent/db";
import { buildApp } from "./app.js";

const database = createDatabase();
runMigrations(database);
const app = buildApp(database);
const port = Number(process.env.PORT ?? 3000);

await app.listen({ host: "127.0.0.1", port });

const shutdown = async () => { await app.close(); database.close(); };
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
