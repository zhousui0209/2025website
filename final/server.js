const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//  提供前端靜態檔案
app.use(express.static(path.join(__dirname, "Public")));

//  留言資料檔
const DATA_FILE = path.join(__dirname, "messages.json");

// 初始化資料檔
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// 讀取留言
app.get("/messages", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  res.json(data.reverse());
});

// 新增留言
app.post("/messages", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "內容不可為空" });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  data.push({
    id: Date.now(),
    content,
    time: new Date().toISOString()
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
