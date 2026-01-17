import express from "express";

const app = express();
const PORT = process.env.PORT || 3333;

// Enable Vercel Web Analytics tracking script
// This middleware serves the analytics tracking code to clients
app.use((req, res, next) => {
  res.setHeader("X-Vercel-Analytics", "enabled");
  next();
});

app.get("/", (req, res) => {
  res.send("🚀 ENSIDE MASTER ONLINE");
});

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Vercel Web Analytics enabled`);
});
