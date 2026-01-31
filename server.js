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
const myldb = `mysql://${process.env.MYSQLHOST}:${process.env.MYSQLUSER}@${process.env.MYSQLPASSWORD}:${process.env.MYSQLDATABASE}/${process.env.MYSQLPORT}`;

const pool = mysql.createPool(myldb);

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

app.get("/home", (req, res) => {
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
    console.log(req.body);
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
