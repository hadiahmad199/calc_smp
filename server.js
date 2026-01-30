const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====================
// Static files (HTML, CSS, images)
// ====================
app.use(express.static(__dirname));

// ====================
// MySQL connection
// ====================
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
}).promise();

pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL successfully!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

// ====================
// Healthcheck + Home page (Railway)
// ====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

// ====================
// API routes
// ====================
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// Start server
// ====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
