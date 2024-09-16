import { Client } from "pg";
import { User } from "src/types/user";
import * as bcrypt from "bcrypt";
import initialUsers from "src/contants/populateUserList";

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME
});

const generateUserQueryString = async (user: Omit<User, "id">) => {
  const pass = await bcrypt.hash(user.password, 10);
  return `('${user.name}', '${user.surname}', '${user.email}', '${pass}', ${user.age}, '${user.country}', '${user.district}', '${user.role}', 'NOW()', 'NOW()')`;
};

export const populateDB = async () => {
  await client.connect();
  const isTableExist = await client.query(
    `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'users'
        )`
  );

  if (!isTableExist.rows[0].exists) {
    await client.query(
      `CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                surname VARCHAR(50) NOT NULL,
                email VARCHAR(250) NOT NULL UNIQUE,
                password VARCHAR(250) NOT NULL,
                age INT NOT NULL,
                country VARCHAR(50) NOT NULL,
                district VARCHAR(50) NOT NULL,
                role VARCHAR(50) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL
            )`
    );
  }

  const isTableEmpty = await client.query("SELECT * FROM users");

  if (isTableEmpty.rowCount > 0) {
    console.info("Database already populated");
    await client.end();
    return;
  }

  const userQueries = await Promise.all(
    initialUsers.map(generateUserQueryString)
  );

  const populateQueryString = `INSERT INTO users (name, surname, email, password, age, country, district, role, "createdAt", "updatedAt") VALUES ${userQueries.join(
    ","
  )}`;

  const res = await client.query(populateQueryString);

  if (res.rowCount === 0) {
    console.error("Database population failed");
    await client.end();
    return;
  }

  console.info("Database populated");
  await client.end();
};
