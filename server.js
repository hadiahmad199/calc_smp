const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// static files
app.use(express.static(__dirname));

// MySQL pool (الصحيح)
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
}).promise();

// test DB
pool.getConnection()
  .then(conn => {
    console.log("✅ Connected to MySQL");
    conn.release();
  })
  .catch(err => {
    console.error("❌ DB Error:", err);
  });

// routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on", PORT);
});
