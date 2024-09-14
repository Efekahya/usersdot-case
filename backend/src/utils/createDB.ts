import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

export const checkDB = async (name: string) => {
  await client.connect();
  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = '${name}'`
  );
  await client.end();
  return res.rowCount > 0;
};

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
  console.log("Database created");
  await client.end();
};
