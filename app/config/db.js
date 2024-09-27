import mysql from "mysql2/promise";

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

console.log("Connecting to database:", process.env.DATABASE_URL);

export default db;
