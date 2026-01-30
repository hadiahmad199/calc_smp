const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // تعريف واحد فقط هنا

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
}).promise();

// اختبار الاتصال
pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL successfully!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

const app = express();
app.use(cors());
app.use(express.json());

// جعل المجلد الحالي متاحاً للملفات الثابتة (صور، تنسيقات)
app.use(express.static(__dirname));

// المسارات (Routes)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get("/api/users", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows); 
});

app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;
    const [result] = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
        [username, email, password]
    );
    res.status(201).send({ id: result.insertId, username, email });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
