const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
}).promise();

// اختبار الاتصال بقاعدة البيانات
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

// 1. إتاحة الملفات الثابتة (مهم جداً لنجاح فحص الجاهزية)
app.use(express.static(__dirname));

// 2. المسار الرئيسي (يجب أن يكون مساراً واحداً فقط)
app.get('/', (req, res) => {
    // سيقوم السيرفر بإرسال ملف HTML الحقيقي بدلاً من مجرد نص
    res.sendFile(path.join(__dirname, 'main.html'));
});

// مسارات الـ API
app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, password]
        );
        res.status(201).send({ id: result.insertId, username, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
  res.send("OK");
});

// 3. تشغيل السيرفر مع تحديد العنوان 0.0.0.0
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
