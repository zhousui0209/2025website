const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 允許跨來源請求（前端與後端不同網址時需要）
app.use(cors());

// 解析 JSON 格式的 request body
app.use(express.json());

// 提供前端靜態檔案（index.html、css、images）
app.use(express.static(path.join(__dirname, "Public")));

// 留言資料檔位置
const DATA_FILE = path.join(__dirname, "messages.json");

// 初始化資料檔（第一次執行時建立空陣列）
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// 讀取所有留言
app.get("/messages", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    // 最新留言顯示在最上面
    res.json(data.reverse());
  } catch (err) {
    console.error("讀取留言失敗：", err);
    res.json([]);
  }
});

// 新增一筆留言
app.post("/messages", (req, res) => {
  const { content } = req.body;

  // 檢查留言是否為空
  if (!content) {
    return res.status(400).json({ error: "內容不可為空" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    data.push({
      id: Date.now(),                 // 使用時間戳當作 ID
      content,                        // 留言內容
      time: new Date().toISOString()  // 留言時間
    });

    // 將更新後的留言寫回檔案
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");

    res.json({ success: true });
  } catch (err) {
    console.error("寫入留言失敗：", err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
