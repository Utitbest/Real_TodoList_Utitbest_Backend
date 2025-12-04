// import mysql from "mysql2/promise"
// import dotenv from "dotenv"
// dotenv.config()


// export const db = await mysql.createConnection({
//     host: process.env.HOST || "localhost",
//     user: process.env.USER || "root",
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE || "tododatabase"
// })

// db.connect((err)=>{
//     if(err){
//         console.log("🥴Error Occured while trying to connect to database!")
//     }else{
//         console.log("😎Connection was Made Successfully to Database!")
//     }
// })
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect()
  .then(() => console.log("😎 Connected to Neon PostgreSQL successfully!"))
  .catch((err) => console.log("🥴 Error connecting to Neon PostgreSQL:", err));
