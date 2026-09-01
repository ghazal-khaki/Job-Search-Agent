# Local data, migration, and backup

The application stores private data locally. By default the SQLite database is
`data/job-search-agent.sqlite`; set `JOB_SEARCH_DATABASE_PATH` to an absolute or
relative path to keep it elsewhere. The `data/` directory, SQLite files, uploads,
and environment files are excluded from Git.

## Create or migrate the database

Use Node.js 24 and enable Corepack, then install and migrate from a fresh clone:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm db:migrate
```

Migrations are checked in under `packages/db/migrations`. Running the command
again is safe; Drizzle records migrations already applied.

## Backup and export

The local data set consists of the SQLite database and, once document uploads are
implemented, the server-owned uploads directory. Stop the application before a
file-level backup so the database, its WAL file, and uploads cannot change during
the copy. Copy the complete configured data directory to encrypted storage. Do
not commit the backup.

For a database-only consistent snapshot while SQLite is open, use SQLite's backup
command (for example `.backup backup.sqlite`) and separately copy the uploads
directory. Restore by stopping the application and replacing both items together,
then run `pnpm db:migrate` to apply any newer checked-in migrations.

This is the baseline backup contract. A later issue can add a redacted, portable
application-level export; raw backups contain private user data and are not safe
to share.
