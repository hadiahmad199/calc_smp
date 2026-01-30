const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
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

// جعل المجلد الحالي متاحاً للملفات الثابتة (CSS, JS, Images)
// ملاحظة: تأكد أن ملفاتك ليست داخل مجلد فرعي، إذا كانت كذلك غير السطر لـ app.use(express.static(path.join(__dirname, 'اسم_المجلد')));
app.use(express.static(__dirname));

// المسار الرئيسي لفتح الموقع (هذا ما سيراه Railway ويدرك أن السيرفر يعمل)
app.get('/', (req, res) => {
    // تأكد أن ملف main.html موجود في المجلد الرئيسي على GitHub
    res.sendFile(path.join(__dirname, 'main.html'));
});

// مسار جلب المستخدمين
app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// مسار إضافة مستخدم جديد
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

// تشغيل السيرفر على 0.0.0.0 للسماح لـ Railway بالوصول إليه
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
