import express from "express";

const app = express();
app.get("/", (_, res) => res.send("API is running!"));

app.listen(3001, () => console.log("✅ API running on port 3001"));
