const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// JSON 資料庫位置
const DB_PATH = path.join(__dirname, "messages.json");

// 確保檔案存在
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// 讀取留言
app.get("/messages", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(data.reverse());
});

// 新增留言
app.post("/messages", (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "留言不可為空" });
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH));
    data.push({
        content,
        createdAt: new Date().toISOString()
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

