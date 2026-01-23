import express from "express";

const app = express();
const PORT = process.env.PORT || 3333;

// Serve static files from the current directory
app.use(express.static('.'));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
