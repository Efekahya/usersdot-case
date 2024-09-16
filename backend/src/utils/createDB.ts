import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DEFAULT,
  ssl: process.env.DB_SSL === "true"
});

export const createDB = async () => {
  await client.connect();
  const dbNameRes = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`
  );

  if (dbNameRes.rowCount > 0) {
    await client.end();
    return;
  }

  await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
  console.info("Database created");
  await client.end();
};
