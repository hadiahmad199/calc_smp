import mysql from 'mysql2'
import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()


const path = require('path');



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
}).promise()

pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL successfully!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });


async function getusers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

// --- إعداد الخادم (Express) ---
const app = express();
app.use(cors())
app.use(express.json());



// مسار لجلب البيانات (GET)
app.get("/api/users", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows); 
});

// مسار لاستقبال بيانات جديدة (POST)
app.post("/api/users", async (req, res) => {
    const { username, email ,password } = req.body;
    const [result] = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
        [username, email, password]
    );
    res.status(201).send({ id: result.insertId, username, email, password });
});
// the req is for the rquested params \res is for the response we get from server
app.get("/api/users/:id", async (req, res) => {
    const id = req.params.id;//here we req the id param then to be stored in the var id
    try{
       const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
       res.json(rows); //here we translate the response we got to a lang that js anderstand
    }catch(error){
        res.status(500).json({error:error.message});//special error for servers 
    };
});




const PORT = process.env.PORT 



// 1. جعل مجلد المشروع متاحاً للزوار (للصور والخطوط والتنسيقات)
app.use(express.static(path.join(calcsmp)));

// 2. إخبار السيرفر بفتح الملف الرئيسي عند الدخول للرابط
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html')); // تأكد أن اسمه login.html أو index.html
});

// 3. تشغيل السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



