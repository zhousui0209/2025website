// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // 讀取.env檔的 ADMIN_PASSWORD

const app = express();
const PORT = 3000;

// 中間件
app.use(cors()); // 前端可以 fetch
app.use(bodyParser.json());

// 建立資料庫
const db = new sqlite3.Database("./messages.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database.");
});

// 建立資料表
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
)`);

// 取得所有留言
app.get("/messages", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 新增留言
app.post("/messages", (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "留言不可為空" });

    db.run("INSERT INTO messages(content) VALUES(?)", [content], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

// 刪除留言 (後台)
app.delete("/messages/:id", (req, res) => {
    const { id } = req.params;
    const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: "密碼錯誤" });
    }

    db.run("DELETE FROM messages WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
