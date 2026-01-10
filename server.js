import express from "express";

const app = express();
const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("🚀 ENSIDE MASTER ONLINE");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
